import { collection, fields } from "@keystatic/core";

const categoryEntries = import.meta.glob<{
  title: string;
  path: string;
}>("../../content/categories/*/index.json", {
  eager: true,
  import: "default",
});

export const categoriesOptions = Object.entries(categoryEntries)
  .map(([filePath, category]) => ({
    label: category.title,
    value: filePath.split("/").slice(-2, -1)[0],
  }))
  .sort((left, right) => left.label.localeCompare(right.label));

export const categoriesKs = collection({
  label: "Categories(分类)",
  slugField: "title",
  path: "src/content/categories/*/",
  columns: ["title"],
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
