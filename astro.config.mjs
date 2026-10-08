// @ts-check
import { writeFile } from "node:fs/promises";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import embedMediaRemark from "./src/lib/utils/embedMediaRemark.mjs";
import { modifiedTime, readingTime } from "./src/lib/utils/remarks.mjs";
import { SITE } from "./src/lib/config";
import keystatic from "@keystatic/astro";
import react from "@astrojs/react";
import { loadEnv } from "vite";
import pagefind from "astro-pagefind";

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
      const paths = new Set(
        pages
          .map(({ pathname }) => pathname.replace(/\/+$/, ""))
          .filter((pathname) => pathname && !/\.[^/]+$/.test(pathname)),
      );
      const redirects = [...paths].map((pathname) =>
        `/${pathname} /${pathname}/ 301`,
      );

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
  markdown: {
    remarkPlugins: [embedMediaRemark, readingTime, modifiedTime],
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
