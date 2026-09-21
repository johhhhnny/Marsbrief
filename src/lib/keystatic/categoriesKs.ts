import { collection, fields } from "@keystatic/core";

export const categoriesKs = collection({
  label: "Categories",
  slugField: "title",
  path: "src/content/categories/*/",
  format: { data: "json" },
  schema: {
    title: fields.slug({
      name: {
        label: "Title (分类名称)",
        description: "分类的显示标题，例如：Musk 生态、人工智能。",
      },
      slug: {
        label: "Slug (标识/目录名)",
        description: "分类的英文标识，用于生成目录名。请使用小写英文或短横线（如 muskempire, ai, fsd）。",
      },
    }),
    path: fields.text({
      label: "Path (URL 路径)",
      description: "页面的 URL 路径，建议与 Slug 保持完全一致（如 muskempire, ai, fsd）。",
      validation: {
        isRequired: true,
        pattern: {
          regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
          message: "必须为小写字母、数字或短横线（如 wisdom, ai, muskempire）",
        },
      },
    }),
  },
});
