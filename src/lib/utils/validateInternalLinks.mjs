import { readdir, readFile } from "node:fs/promises";
import { relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "parse5";
import { slug } from "github-slugger";

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = new URL(
        `${encodeURIComponent(entry.name)}${entry.isDirectory() ? "/" : ""}`,
        directory,
      );
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );
  return nestedFiles.flat();
}

function normalizePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  if (decoded === "/") return "/";
  return decoded.replace(/\/{2,}/g, "/").replace(/\/$/, "");
}

function normalizeBasePath(basePath) {
  if (!basePath || basePath === "/") return "";
  return `/${basePath.replace(/^\/+|\/+$/g, "")}`;
}

function articleRouteId(articleId) {
  return articleId
    .split("/")
    .map((segment) => slug(segment))
    .join("/");
}

function withBasePath(pathname, basePrefix) {
  if (!basePrefix) return pathname;
  if (pathname === basePrefix || pathname.startsWith(`${basePrefix}/`)) {
    return pathname;
  }
  return `${basePrefix}${pathname === "/" ? "/" : pathname}`;
}

function addRouteVariants(routes, pathname) {
  const normalized = normalizePath(pathname);
  routes.add(normalized);
  routes.add(normalized === "/" ? "/" : `${normalized}/`);
}

function outputPathForFile(filePath, outputDirectory, basePrefix) {
  const file = relative(outputDirectory, filePath)
    .split(sep)
    .join("/");
  const isHtml = /\.html$/i.test(file);
  let pathname = `/${file}`;
  if (/\/index\.html$/i.test(pathname)) {
    pathname = pathname.replace(/index\.html$/i, "");
  } else if (/\.html$/i.test(pathname)) {
    pathname = pathname.replace(/\.html$/i, "");
  }
  return { isHtml, pathname: withBasePath(pathname, basePrefix) };
}

function walk(node, visitor) {
  visitor(node);
  for (const child of node.childNodes ?? []) walk(child, visitor);
}

export default async function validateInternalLinks({
  dir,
  siteUrl,
  basePath = "/",
  articleSlugAliases = {},
}) {
  const outputDirectory = fileURLToPath(dir);
  const basePrefix = normalizeBasePath(basePath);
  const siteOrigin = new URL(siteUrl).origin;
  const files = await listFiles(dir);
  const availablePaths = new Set();
  const htmlFiles = [];

  for (const fileUrl of files) {
    const filePath = fileURLToPath(fileUrl);
    const { isHtml, pathname } = outputPathForFile(
      filePath,
      outputDirectory,
      basePrefix,
    );
    if (isHtml) {
      const route = pathname.replace(/\/index\.html$/i, "").replace(/\.html$/i, "");
      addRouteVariants(availablePaths, route);
      htmlFiles.push({ fileUrl, sourceRoute: route });
    } else {
      availablePaths.add(normalizePath(pathname));
    }
  }

  for (const [oldId, newId] of Object.entries(articleSlugAliases)) {
    let resolvedId = newId;
    const visitedAliases = new Set([oldId]);
    while (articleSlugAliases[resolvedId]) {
      if (visitedAliases.has(resolvedId)) {
        throw new Error(`文章 slug 别名存在循环：「${resolvedId}」。`);
      }
      visitedAliases.add(resolvedId);
      resolvedId = articleSlugAliases[resolvedId];
    }

    const oldPath = withBasePath(
      `/articles/${articleRouteId(oldId)}/`,
      basePrefix,
    );
    const newPath = withBasePath(
      `/articles/${articleRouteId(resolvedId)}/`,
      basePrefix,
    );
    if (
      normalizePath(oldPath) !== normalizePath(newPath) &&
      availablePaths.has(normalizePath(oldPath))
    ) {
      throw new Error(`文章 slug 别名「${oldId}」与现存文章路由冲突。`);
    }
    if (!availablePaths.has(normalizePath(newPath))) {
      throw new Error(`文章 slug 别名「${oldId}」指向不存在的文章「${resolvedId}」。`);
    }
    addRouteVariants(availablePaths, oldPath);
  }

  const failures = [];
  for (const { fileUrl, sourceRoute } of htmlFiles) {
    const html = await readFile(fileUrl, "utf8");
    const document = parse(html);
    walk(document, (node) => {
      if (node.tagName !== "a") return;
      const href = node.attrs?.find((attribute) => attribute.name === "href")?.value;
      if (href === undefined) return;

      let target;
      try {
        target = new URL(href, new URL(sourceRoute, siteUrl));
      } catch {
        failures.push(`${relative(outputDirectory, fileURLToPath(fileUrl))}: 无效链接 ${href}`);
        return;
      }
      if (target.origin !== siteOrigin) return;

      const targetPath = normalizePath(target.pathname);
      if (!availablePaths.has(targetPath)) {
        failures.push(
          `${relative(outputDirectory, fileURLToPath(fileUrl))}: 找不到站内目标 ${target.pathname}`,
        );
      }
    });
  }

  if (failures.length > 0) {
    const shownFailures = failures.slice(0, 30).join("\n");
    const remaining = failures.length - 30;
    throw new Error(
      `站内链接校验失败（${failures.length} 项）：\n${shownFailures}${remaining > 0 ? `\n另有 ${remaining} 项未显示。` : ""
      }`,
    );
  }
}