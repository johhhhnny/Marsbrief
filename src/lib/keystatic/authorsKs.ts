import { collection, fields } from "@keystatic/core";

const authorEntries = import.meta.glob<{ name: string }>(
  "../../content/authors/*/index.mdx",
  { eager: true, import: "frontmatter" }
);

export const authorsOptions = Object.entries(authorEntries)
  .map(([filePath, author]) => ({
    label: author.name,
    value: filePath.split("/").slice(-2, -1)[0],
  }))
  .sort((left, right) => left.label.localeCompare(right.label));

export const authorsKs = collection({
  label: "Authors（作者）",
  slugField: "name",
  path: "src/content/authors/*/",
  format: { contentField: "content" },
  entryLayout: "form",
  schema: {
    name: fields.slug({ name: { label: "Name（姓名）" } }),
    job: fields.text({ label: "Job（职位）" }),
    avatar: fields.image({
      label: "Avatar（头像）",
      directory: "src/assets/images/authors",
      publicPath: "@assets/images/authors",
    }),
    bio: fields.text({ label: "Bio（简介）" }),
    social: fields.array(
      fields.object({
        name: fields.text({ label: "Name（名称）", validation: { isRequired: true } }),
        url: fields.url({ label: "URL（链接）", validation: { isRequired: true } }),
        icon: fields.text({ label: "Icon（图标）", validation: { isRequired: true } }),
      }),
      {
        label: "Social Links（社交链接） ",
        itemLabel: (props) => props.fields?.name.value ?? "",
      }
    ),
    content: fields.mdx({
      label: "Content（内容）",
      options: {
        image: {
          directory: "src/assets/images/authors",
          publicPath: "@assets/images/authors",
        },
      },
    }),
  },
});
