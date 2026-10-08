import { getCollection, type CollectionEntry } from "astro:content";
import { articlesHandler } from "./articles";

const normalizeTag = (tag: string) => tag.trim().toLowerCase();
const slugFromEntry = (tag: CollectionEntry<"tags">) => tag.id.split("/")[0];

export const tagsHandler = {
  allTagsWithArticleCounts: async () => {
    const [tags, articles] = await Promise.all([
      getCollection("tags"),
      articlesHandler.allArticles(),
    ]);

    return tags
      .map((tag) => {
        const slug = slugFromEntry(tag);
        const taggedArticles = articles.filter((article) =>
          article.data.tags.some((articleTag) => normalizeTag(articleTag) === slug),
        );

        return {
          tag,
          slug,
          articles: taggedArticles,
          count: taggedArticles.length,
        };
      })
      .filter(({ count }) => count > 0)
      .sort((a, b) => a.tag.data.title.localeCompare(b.tag.data.title));
  },

  tagsForArticle: async (article: CollectionEntry<"articles">) => {
    const tags = await getCollection("tags");
    const tagsBySlug = new Map(
      tags.map((tag) => [slugFromEntry(tag), tag] as const),
    );
    const articleTagSlugs = new Set(article.data.tags.map(normalizeTag));

    return [...articleTagSlugs].flatMap((slug) => {
      const tag = tagsBySlug.get(slug);
      return tag ? [{ tag, slug }] : [];
    });
  },
};