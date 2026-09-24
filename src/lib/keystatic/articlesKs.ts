import { collection, fields } from "@keystatic/core";

export const articlesKs = collection({
  label: "Articles（文章）",
  slugField: "title",
  columns: ["title", "publishedTime"],
  path: "src/content/articles/*/",
  format: { contentField: "content" },
  entryLayout: "form",
  schema: {
    isDraft: fields.checkbox({
      label: "Is this a draft?（是否草稿）",
      defaultValue: false,
    }),
    isMainHeadline: fields.checkbox({
      label: "Is this a main headline?（是否主头条）",
      defaultValue: false,
    }),
    isSubHeadline: fields.checkbox({
      label: "Is this a sub headline?（是否副头条）",
      defaultValue: false,
    }),
    description: fields.text({
      label: "Description（摘要）",
      validation: { isRequired: true, length: { max: 160 } },
    }),
    title: fields.slug({
      name: { label: "Title", validation: { length: { max: 60 } } },
    }),
    cover: fields.image({
      label: "Cover Image（封面图）",
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
      label: "Published Time（发布时间）",
      validation: { isRequired: true },
    }),
    authors: fields.array(
      fields.relationship({
        label: "Authors（作者）",
        collection: "authors",
      }),
      {
        label: "Authors（作者）",
        itemLabel: (props) => props.value ?? "",
        validation: {
          length: {
            min: 1,
          },
        },
      }
    ),
    content: fields.mdx({
      label: "Content（内容）",
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
