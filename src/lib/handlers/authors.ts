import { getCollection } from "astro:content";

export const authorsHandler = {
  allAuthors: async () => {
    return await getCollection("authors");
  },
  limitAurhors: async (limit: number) => {
    const authorsCollection = await getCollection("authors");
    return authorsCollection.slice(0, limit);
  },
  getAuthors: async (authors: { collection: string; id: string }[]) => {
    const authorsCollection = await getCollection("authors");
    return authors
      .map(({ id }) => {
        const author = authorsCollection.find((author) => author.id === id);
        return author || null;
      })
      .filter((author) => author !== null);
  },
  findAuthor: async (id: string) => {
    const authorsCollection = await getCollection("authors");
    const author = authorsCollection.find((author) => author.id === id);
    return author || null;
  },
};
