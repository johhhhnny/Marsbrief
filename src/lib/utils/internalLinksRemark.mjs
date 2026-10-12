import { readdirSync } from "node:fs";
import { relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { slug } from "github-slugger";
import { parseFragment } from "parse5";

const articlesDirectory = fileURLToPath(
  new URL("../../content/articles/", import.meta.url),
);

function collectArticleIds(directory = articlesDirectory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return collectArticleIds(entryPath);
    if (!/\.(?:md|mdx)$/i.test(entry.name)) return [];

    const id = relative(articlesDirectory, entryPath)
      .split(sep)
      .join("/")
      .replace(/\.(?:md|mdx)$/i, "")
      .replace(/(?:^|\/)index$/, "");
    return [id];
  });
}

function attributeValue(node, name) {
  const attribute = node.attributes?.find(
    (candidate) => candidate.type === "mdxJsxAttribute" && candidate.name === name,
  );
  return typeof attribute?.value === "string" ? attribute.value : null;
}

function rawHtmlComponent(node) {
  if (node.type !== "html") return null;

  const element = parseFragment(node.value).childNodes.find(
    (child) => typeof child.tagName === "string",
  );
  if (!element || !["articlelink", "pagelink"].includes(element.tagName)) {
    return null;
  }

  return {
    name: element.tagName === "articlelink" ? "ArticleLink" : "PageLink",
    attributes: Object.fromEntries(
      element.attrs.map(({ name, value }) => [name, value]),
    ),
  };
}

function withBasePath(path, basePath) {
  const prefix = basePath === "/" ? "" : `/${basePath.replace(/^\/+|\/+$/g, "")}`;
  return `${prefix}${path}`;
}

function articleRouteId(articleId) {
  return articleId
    .split("/")
    .map((segment) => slug(segment))
    .join("/");
}

function fail(file, node, message) {
  const location = node.position?.start;
  const source = file.path ?? "MDX content";
  const suffix = location ? `:${location.line}:${location.column}` : "";
  throw new Error(`${source}${suffix}: ${message}`);
}

export default function internalLinksRemark({
  pages,
  basePath = "/",
  articleSlugAliases = {},
}) {
  const pagePaths = new Map(pages.map(({ key, path }) => [key, path]));

  return (tree, file) => {
    const articleIds = new Set(collectArticleIds());
    const visit = (parent) => {
      if (!Array.isArray(parent.children)) return;

      parent.children = parent.children.map((node) => {
        const rawComponent = rawHtmlComponent(node);
        const componentName = rawComponent?.name ?? node.name;
        if (
          ((node.type === "mdxJsxTextElement" ||
            node.type === "mdxJsxFlowElement") || rawComponent) &&
          (componentName === "ArticleLink" || componentName === "PageLink")
        ) {
          const getAttribute = (name) =>
            rawComponent?.attributes[name] ?? attributeValue(node, name);
          const text = getAttribute("text");
          if (!text) fail(file, node, "内链缺少链接文字。");

          let targetPath;
          if (componentName === "ArticleLink") {
            const articleId = getAttribute("article");
            let resolvedArticleId = articleId;
            const visitedAliases = new Set();
            while (articleSlugAliases[resolvedArticleId]) {
              if (visitedAliases.has(resolvedArticleId)) {
                fail(file, node, `文章 slug 别名存在循环：「${resolvedArticleId}」。`);
              }
              visitedAliases.add(resolvedArticleId);
              resolvedArticleId = articleSlugAliases[resolvedArticleId];
            }
            if (!articleId || !articleIds.has(resolvedArticleId)) {
              fail(file, node, `找不到目标文章「${articleId || "未选择"}」。`);
            }
            const encodedId = articleRouteId(resolvedArticleId)
              .split("/")
              .map((segment) => encodeURIComponent(segment))
              .join("/");
            targetPath = `/articles/${encodedId}/`;
          } else {
            const pageKey = getAttribute("page");
            targetPath = pagePaths.get(pageKey);
            if (!targetPath) {
              fail(file, node, `找不到目标页面「${pageKey || "未选择"}」。`);
            }
          }

          return {
            type: "link",
            url: withBasePath(targetPath, basePath),
            children: [{ type: "text", value: text }],
            position: node.position,
          };
        }

        visit(node);
        return node;
      });
    };

    visit(tree);
  };
}