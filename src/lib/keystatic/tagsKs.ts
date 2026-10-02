import { collection, fields } from "@keystatic/core";

export const tagsKs = collection({
  label: "Tags (标签)",
  slugField: "title",
  path: "src/content/tags/*/",
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