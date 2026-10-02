import { PagefindUI } from "@pagefind/default-ui";

declare global {
  interface Window {
    __pagefind_initialized__?: boolean;
  }
}

const initializePagefind = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__pagefind_initialized__) return;

  const target = document.querySelector("#search");
  if (!target) {
    console.warn("Pagefind target element not found");
    return;
  }

  try {
    new PagefindUI({
      element: "#search",
      bundlePath: "/pagefind/",
      showSubResults: true,
      showImages: false,
      autofocus: true,
      translations: {
        placeholder: "搜索文章...",
        clear_search: "清除",
        load_more: "加载更多",
        search_label: "搜索此站点",
        filters_label: "筛选",
        zero_results: "未找到 [SEARCH_TERM] 的相关结果",
        many_results: "找到 [COUNT] 条 [SEARCH_TERM] 的相关结果",
        one_result: "找到 1 条 [SEARCH_TERM] 的相关结果",
        alt_search:
          "未找到 [SEARCH_TERM] 的相关结果。显示 [DIFFERENT_TERM] 的结果：",
        search_suggestion:
          "未找到 [SEARCH_TERM] 的相关结果。请尝试以下搜索之一：",
        searching: "正在搜索 [SEARCH_TERM]...",
      },
    });
    window.__pagefind_initialized__ = true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Pagefind init failed:", error);
  }
};

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePagefind);
  } else {
    initializePagefind();
  }

  document.addEventListener("astro:page-load", initializePagefind);
}