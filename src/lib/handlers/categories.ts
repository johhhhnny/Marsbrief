import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { articlesHandler } from "./articles";

const categoryReferences = (article: CollectionEntry<"articles">) =>
  article.data.category;

export const categoriesHandler = {
  allCategories: async () => {
    const categoriesCollection = await getCollection("categories");
    return categoriesCollection.sort((a, b) =>
      a.data.title.localeCompare(b.data.title)
    );
  },
  oneCategory: async (categoryIdOrPath: string) => {
    const categoriesCollection = await getCollection("categories");
    const category = categoriesCollection.find(
      (category) =>
        category.id === categoryIdOrPath || category.data.path === categoryIdOrPath
    );
    return category || null;
  },
  allCategoriesForArticle: async (article: CollectionEntry<"articles">) =>
    Promise.all(
      categoryReferences(article).map((category) =>
        categoriesHandler.oneCategory(category.id)
      )
    ),
  articleHasCategory: (
    article: CollectionEntry<"articles">,
    categoryIdOrPath: string
  ) => categoryReferences(article).some((category) => category.id === categoryIdOrPath),
  allCategoriesWithLatestArticles: async () => {
    const categoriesCollection = await getCollection("categories");
    const allArticles = await articlesHandler.allArticles();
    return categoriesCollection.map((category) => {
      const articles = allArticles.filter(
        (article) =>
          categoriesHandler.articleHasCategory(article, category.id) ||
          categoriesHandler.articleHasCategory(article, category.data.path)
      );
      return {
        ...category,
        data: {
          ...category.data,
          count: articles.length,
          latestArticles: articles.slice(0, 3),
        },
      };
    });
  },
};