import { getCollection } from "astro:content";

export const articlesHandler = {
  allArticles: async () => {
    const articles = await getCollection("articles", ({ data }) => {
      return (
        data.isDraft !== true &&
        (import.meta.env.DEV || new Date(data.publishedTime) <= new Date())
      );
    });
    return articles.sort((a, b) =>
      new Date(b.data.publishedTime)
        .toISOString()
        .localeCompare(new Date(a.data.publishedTime).toISOString())
    );
  },

  mainHeadline: async () => {
    const articlesCollection = await articlesHandler.allArticles();
    const article = articlesCollection.filter(
      (article) => article.data.isMainHeadline === true
    )[0];
    if (!article) return articlesCollection[0] || null;
    return article;
  },

  subHeadlines: async () => {
    const articlesCollection = await articlesHandler.allArticles();
    const mainHeadline = await articlesHandler.mainHeadline();
    const subHeadlines = articlesCollection
      .filter(
        (article) =>
          article.data.isSubHeadline === true &&
          (mainHeadline ? mainHeadline.id !== article.id : true)
      )
      .slice(0, 4);

    if (subHeadlines.length === 0) {
      return articlesCollection
        .filter(
          (article) => (mainHeadline ? mainHeadline.id !== article.id : true)
        )
        .slice(0, 4);
    }
    return subHeadlines;
  },
};
