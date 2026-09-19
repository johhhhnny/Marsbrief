import type { Link } from "../types";

export const SITE = {
  title: "MARS BRIEF",
  description: "从 Musk 出发，看懂正在形成的未来世界。",
  author: "Mars Brief 编辑部",
  url: "https://marsbrief.com",
  github: "",
  locale: "zh-CN",
  dir: "ltr",
  charset: "UTF-8",
  basePath: "/",
  postsPerPage: 4,
};

export const NAVIGATION_LINKS: Link[] = [
  {
    href: "/articles",
    text: "深度分析",
  },
  {
    href: "/categories/log",
    text: "每日精选",
  },
  {
    href: "/categories/musk",
    text: "Musk 生态",
  },
  {
    href: "/categories/ai",
    text: "AI 与机器人",
  },
];

export const OTHER_LINKS: Link[] = [
  {
    href: "/about",
    text: "关于我们",
  },
  {
    href: "/authors",
    text: "作者列表",
  },
  {
    href: "/contact",
    text: "联系我们",
  },
  {
    href: "/privacy",
    text: "隐私政策",
  },
  {
    href: "/terms",
    text: "服务条款",
  },
  {
    href: "/cookie-policy",
    text: "Cookie 政策",
  },
  {
    href: "/rss.xml",
    text: "RSS 订阅",
  },
  {
    href: "/sitemap-index.xml",
    text: "站点地图",
  },
];

export const SOCIAL_LINKS: Link[] = [
  {
    href: "https://x.com",
    text: "X",
    icon: "newTwitter",
  },
  {
    href: "https://www.youtube.com",
    text: "YouTube",
    icon: "telegram",
  },
];
