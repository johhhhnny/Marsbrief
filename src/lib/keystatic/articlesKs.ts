import { collection, fields } from "@keystatic/core";

export const articlesKs = collection({
  label: "Articles",
  slugField: "title",
  path: "src/content/articles/*/",
  format: { contentField: "content" },
  entryLayout: "form",
  schema: {
    isDraft: fields.checkbox({
      label: "Is this a draft?",
      defaultValue: false,
    }),
    isMainHeadline: fields.checkbox({
      label: "Is this a main headline?",
      defaultValue: false,
    }),
    isSubHeadline: fields.checkbox({
      label: "Is this a sub headline?",
      defaultValue: false,
    }),
    description: fields.text({
      label: "Description",
      validation: { isRequired: true, length: { max: 160 } },
    }),
    title: fields.slug({
      name: { label: "Title", validation: { length: { max: 60 } } },
    }),
    cover: fields.image({
      label: "Cover",
      directory: "src/assets/images/articles",
      publicPath: "@assets/images/articles/",
      description: "可选。未上传封面时将使用默认图片。",
    }),
    category: fields.array(
      fields.relationship({
        label: "Category (分类)",
        collection: "categories",
      }),
      {
        label: "Categories (分类)",
        itemLabel: (props) => props.value ?? "",
        validation: { length: { min: 1 } },
      }
    ),
    publishedTime: fields.datetime({
      label: "Published Time",
      validation: { isRequired: true },
    }),
    authors: fields.array(
      fields.relationship({
        label: "Authors",
        collection: "authors",
      }),
      {
        label: "Authors",
        itemLabel: (props) => props.value ?? "",
        validation: {
          length: {
            min: 1,
          },
        },
      }
    ),
    content: fields.mdx({
      label: "Content",
      extension: "md",
      options: {
        image: {
          directory: "src/assets/images/articles",
          publicPath: "@assets/images/articles",
        },
      },
    }),
  },
});
