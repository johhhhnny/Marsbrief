import { collection, fields } from "@keystatic/core";

const tagEntries = import.meta.glob<{ title: string }>(
  "../../content/tags/*/index.json",
  { eager: true, import: "default" }
);

export const tagsOptions = Object.entries(tagEntries)
  .map(([filePath, tag]) => ({
    label: tag.title,
    value: filePath.split("/").slice(-2, -1)[0],
  }))
  .sort((left, right) => left.label.localeCompare(right.label));

export const tagsKs = collection({
  label: "Tags (标签)",
  slugField: "title",
  path: "src/content/tags/*/",
  columns: ["title"],
  format: { data: "json" },
  schema: {
    title: fields.slug({
      name: {
        label: "Title (标签名称)",
        description: "添加后即可在文章编辑表单中选择该标签。",
      },
      slug: {
        label: "Slug (标识/目录名)",
        description: "用于标签的唯一标识，请使用小写英文、数字或短横线。",
      },
    }),
  },
});