export const internalLinkPages = [
  { key: "home", label: "首页", path: "/" },
  { key: "articles", label: "文章列表", path: "/articles/" },
  { key: "authors", label: "作者列表", path: "/authors/" },
  { key: "categories", label: "分类列表", path: "/categories/" },
  { key: "tags", label: "标签列表", path: "/tags/" },
  { key: "search", label: "搜索", path: "/search/" },
  { key: "about", label: "关于我们", path: "/about/" },
  { key: "privacy", label: "隐私政策", path: "/privacy/" },
  { key: "terms", label: "服务条款", path: "/terms/" },
  { key: "cookie-policy", label: "Cookie 政策", path: "/cookie-policy/" },
] as const;

export const internalLinkPageOptions = [
  { label: "请选择页面", value: "" },
  ...internalLinkPages.map(({ key, label }) => ({ label, value: key })),
];