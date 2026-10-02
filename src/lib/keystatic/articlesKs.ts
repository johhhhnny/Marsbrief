import { collection, fields } from "@keystatic/core";
import { authorsOptions } from "./authorsKs";
import { categoriesOptions } from "./categoriesKs";
import { checkboxGridMultiselect } from "./checkboxGridMultiselect";
import { tagsOptions } from "./tagsKs";

const publishedTimeField = fields.datetime({
  label: "Published Time（发布时间）",
  validation: { isRequired: true },
});

const formatLocalDateTime = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const readStoredDate = (value: unknown) => {
  const date =
    value instanceof Date
      ? value
      : typeof value === "string"
        ? new Date(value)
        : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const localPublishedTimeField = {
  ...publishedTimeField,
  parse(value: Parameters<typeof publishedTimeField.parse>[0]) {
    const parsed = publishedTimeField.parse(value);
    if (parsed === null) return null;
    const date = readStoredDate(value);
    return date ? formatLocalDateTime(date) : parsed;
  },
  serialize(value: Parameters<typeof publishedTimeField.serialize>[0]) {
    if (value === null) return publishedTimeField.serialize(value);
    const utcDateTime = new Date(value).toISOString().slice(0, 16);
    return publishedTimeField.serialize(utcDateTime);
  },
  reader: {
    parse(value: Parameters<typeof publishedTimeField.reader.parse>[0]) {
      const parsed = publishedTimeField.reader.parse(value);
      if (parsed === null) return null;
      const date = readStoredDate(value);
      return date ? formatLocalDateTime(date) : parsed;
    },
  },
};

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
      name: { label: "Title（标题）", validation: { length: { max: 60 } } },
    }),
    cover: fields.image({
      label: "Cover Image（封面图）",
      directory: "src/assets/images/articles",
      publicPath: "@assets/images/articles/",
      validation: { isRequired: true },
      description: "请务必上传一张封面图。",
    }),
    category: checkboxGridMultiselect({
      label: "Categories (分类)",
      description: "至少选择一个分类。",
      options: categoriesOptions,
      required: true,
    }),
    tags: checkboxGridMultiselect({
      label: "Tags (标签)",
      options: tagsOptions,
    }),
    publishedTime: localPublishedTimeField,
    authors: checkboxGridMultiselect({
      label: "Authors（作者）",
      description: "至少选择一位作者。",
      options: authorsOptions,
      required: true,
    }),
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
