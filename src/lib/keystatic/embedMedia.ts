import { fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";
import { createElement } from "react";

const embedUrlPattern = /^(?:https:\/\/(?:(?:www|m)\.)?youtube\.com\/(?:watch\?(?:[^#]*&)?v=|(?:embed|shorts|live)\/)[A-Za-z0-9_-]{11}(?:[?&][^\s]*)?|https:\/\/youtu\.be\/[A-Za-z0-9_-]{11}(?:[?&][^\s]*)?|https:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/(?:[^/?#]+\/)?status\/\d+(?:[/?#][^\s]*)?)$/i;

export const embedMedia = block({
  label: "嵌入媒体",
  description: "粘贴 YouTube 视频链接或 X 帖子链接，系统会自动识别平台。",
  schema: {
    url: fields.text({
      label: "媒体链接",
      description: "支持 YouTube 视频以及包含视频的 X 帖子。",
      validation: {
        isRequired: true,
        pattern: {
          regex: embedUrlPattern,
          message: "请输入有效的 YouTube 视频链接或 X 帖子链接。",
        },
      },
    }),
  },
  ContentView: ({ value }) => {
    const url = value.url ?? "";
    const provider = /(?:^|\/\/)(?:www\.)?(?:x\.com|twitter\.com)\//i.test(url)
      ? "X 帖子"
      : "YouTube 视频";

    return createElement(
      "div",
      {
        style: {
          border: "1px solid #d0d5dd",
          borderRadius: 6,
          padding: "12px 16px",
        },
      },
      createElement("strong", null, `嵌入媒体 · ${provider}`),
      createElement(
        "p",
        { style: { margin: "6px 0 0", overflowWrap: "anywhere" } },
        url
      )
    );
  },
});