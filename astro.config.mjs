// @ts-check
import { writeFile } from "node:fs/promises";
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import embedMediaRemark from "./src/lib/utils/embedMediaRemark.mjs";
import internalLinksRemark from "./src/lib/utils/internalLinksRemark.mjs";
import validateInternalLinks from "./src/lib/utils/validateInternalLinks.mjs";
import { modifiedTime, readingTime } from "./src/lib/utils/remarks.mjs";
import { SITE } from "./src/lib/config";
import { internalLinkPages } from "./src/lib/config/internalLinkPages";
import { articleSlugAliases } from "./src/lib/config/articleSlugAliases";
import keystatic from "@keystatic/astro";
import react from "@astrojs/react";
import { loadEnv } from "vite";
import pagefind from "astro-pagefind";
import { slug } from "github-slugger";

const { RUN_KEYSTATIC } = loadEnv(import.meta.env.MODE, process.cwd(), "");

const integrations = [mdx(), sitemap(), pagefind()];

const enableKeystatic = RUN_KEYSTATIC === "true" && import.meta.env.DEV;
if (enableKeystatic) {
  integrations.push(react());
  integrations.push(keystatic());
}

integrations.push({
  name: "trailing-slash-redirects",
  hooks: {
    "astro:build:done": async ({ dir, pages }) => {
      await validateInternalLinks({
        dir,
        siteUrl: SITE.url,
        basePath: SITE.basePath,
        articleSlugAliases,
      });
      const paths = new Set(
        pages
          .map(({ pathname }) => pathname.replace(/\/+$/, ""))
          .filter((pathname) => pathname && !/\.[^/]+$/.test(pathname)),
      );
      const trailingSlashRedirects = [...paths].map((pathname) =>
        `/${pathname} /${pathname}/ 301`,
      );
      const basePrefix =
        SITE.basePath === "/"
          ? ""
          : `/${SITE.basePath.replace(/^\/+|\/+$/g, "")}`;
      const articleSlugRedirects = Object.entries(articleSlugAliases).map(
        ([oldId, newId]) => {
          let resolvedId = newId;
          const visitedAliases = new Set([oldId]);
          while (articleSlugAliases[resolvedId]) {
            if (visitedAliases.has(resolvedId)) {
              throw new Error(`文章 slug 别名存在循环：「${resolvedId}」。`);
            }
            visitedAliases.add(resolvedId);
            resolvedId = articleSlugAliases[resolvedId];
          }
          /** @param {string} id */
          const routeId = (id) =>
            id
              .split("/")
              .map((segment) => slug(segment))
              .join("/");
          return `${basePrefix}/articles/${routeId(oldId)}/ ${basePrefix}/articles/${routeId(resolvedId)}/ 301`;
        },
      );
      const redirects = [...new Set([...trailingSlashRedirects, ...articleSlugRedirects])];

      if (redirects.length > 2000) {
        throw new Error("Cloudflare Pages supports at most 2000 static redirects.");
      }

      await writeFile(new URL("_redirects", dir), `${redirects.join("\n")}\n`);
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  base: SITE.basePath,
  adapter: cloudflare({ imageService: "compile" }),
  markdown: {
    remarkPlugins: [
      [internalLinksRemark, { pages: internalLinkPages, basePath: SITE.basePath }],
      embedMediaRemark,
      readingTime,
      modifiedTime,
    ],
  },
  image: {
    responsiveStyles: true,
    breakpoints: [640, 1024],
    domains: ["cloudflare.com", "r2.dev", "marsbrief.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.marsbrief.net",
      },
    ],
  },
  integrations,
  vite: {
    plugins: [tailwindcss()],
  },
});
