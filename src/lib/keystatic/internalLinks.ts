import { fields } from "@keystatic/core";
import { inline } from "@keystatic/core/content-components";
import { internalLinkPageOptions } from "../config/internalLinkPages";

export const internalLinkComponents = {
  ArticleLink: inline({
    label: "文章内链",
    description: "填写链接文字并搜索选择目标文章。",
    schema: {
      text: fields.text({ label: "链接文字", validation: { isRequired: true } }),
      article: fields.relationship({
        label: "目标文章",
        collection: "articles",
        validation: { isRequired: true },
      }),
    },
    ContentView: ({ value }) => value.text || "文章内链",
  }),
  PageLink: inline({
    label: "页面内链",
    description: "填写链接文字并选择目标页面。",
    schema: {
      text: fields.text({ label: "链接文字", validation: { isRequired: true } }),
      page: fields.select({
        label: "目标页面",
        options: internalLinkPageOptions,
        defaultValue: "",
      }),
    },
    ContentView: ({ value }) => value.text || "页面内链",
  }),
};