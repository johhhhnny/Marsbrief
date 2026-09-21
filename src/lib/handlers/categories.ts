import { getCollection } from "astro:content";
import { articlesHandler } from "./articles";

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
  allCategoriesWithLatestArticles: async () => {
    const categoriesCollection = await getCollection("categories");
    const allArticles = await articlesHandler.allArticles();
    return categoriesCollection.map((category) => {
      const articles = allArticles.filter(
        (article) =>
          article.data.category.id === category.id ||
          article.data.category.id === category.data.path
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