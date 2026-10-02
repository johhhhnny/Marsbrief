import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import {
  articleSchema,
  authorSchema,
  categorySchema,
  tagSchema,
  viewSchema,
} from "@/lib/schema";

const articleCollection = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content/articles",
  }),
  schema: ({ image }) => articleSchema(image),
});

const viewCollection = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/views" }),
  schema: viewSchema,
});

const categoryCollection = defineCollection({
  loader: glob({ pattern: "**/index.json", base: "./src/content/categories" }),
  schema: categorySchema,
});

const tagCollection = defineCollection({
  loader: glob({ pattern: "**/index.json", base: "./src/content/tags" }),
  schema: tagSchema,
});

const authorCollection = defineCollection({
  loader: glob({ pattern: "**/index.mdx", base: "./src/content/authors" }),
  schema: ({ image }) => authorSchema(image),
});

export const collections = {
  articles: articleCollection,
  views: viewCollection,
  categories: categoryCollection,
  tags: tagCollection,
  authors: authorCollection,
};
