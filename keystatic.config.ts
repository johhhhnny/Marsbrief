import { articlesKs, authorsKs, categoriesKs, tagsKs } from "@/lib/keystatic";
import { config } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "marsbrief",
    },
    navigation: ["---", "articles", "---", "authors", "categories", "tags"],
  },
  collections: {
    articles: articlesKs,
    authors: authorsKs,
    categories: categoriesKs,
    tags: tagsKs,
  },
});
