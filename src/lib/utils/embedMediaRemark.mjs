import { parseFragment } from "parse5";

const youtubeHosts = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
]);
const xHosts = new Set(["x.com", "www.x.com", "twitter.com", "www.twitter.com"]);

function identifyMedia(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;

    if (youtubeHosts.has(url.hostname)) {
      const videoId =
        url.hostname === "youtu.be"
          ? url.pathname.split("/").filter(Boolean)[0]
          : url.pathname === "/watch"
            ? url.searchParams.get("v")
            : url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];

      return videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId)
        ? { provider: "youtube", id: videoId }
        : null;
    }

    if (xHosts.has(url.hostname)) {
      const postId = url.pathname.match(/^\/(?:[^/]+\/)?status\/(\d+)(?:\/|$)/)?.[1];
      if (!postId) return null;

      url.hash = "";
      return { provider: "x", id: postId, url: url.href };
    }

    return null;
  } catch {
    return null;
  }
}

function readEmbedMedia(html) {
  const fragment = parseFragment(html);
  if (fragment.childNodes.length !== 1) return null;

  const [element] = fragment.childNodes;
  if (!element.tagName || element.tagName !== "embedmedia") return null;

  const url = element.attrs.find((attribute) => attribute.name === "url")?.value;
  return { media: url ? identifyMedia(url) : null };
}

function renderMedia(media) {
  if (!media) {
    return "<p>无法识别此媒体链接，请使用有效的 YouTube 视频或 X 帖子链接。</p>";
  }

  if (media.provider === "youtube") {
    return `<div style="aspect-ratio: 16 / 9; margin: 1.5rem 0; overflow: hidden; border-radius: 0.5rem;">
  <iframe src="https://www.youtube-nocookie.com/embed/${media.id}" title="YouTube 视频播放器" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="display: block; width: 100%; height: 100%; border: 0;"></iframe>
</div>`;
  }

  return `<div data-x-post-embed data-pagefind-ignore="all">
  <div data-x-post-id="${media.id}"></div>
  <p data-x-post-fallback><a href="${media.url}" rel="noopener noreferrer">在 X 查看这条帖子</a></p>
</div>`;
}

function transformNodes(node) {
  if (!Array.isArray(node.children)) return;

  node.children = node.children.map((child) => {
    if (child.type === "html") {
      const embed = readEmbedMedia(child.value);
      if (embed) {
        return {
          type: "html",
          value: renderMedia(embed.media),
          position: child.position,
        };
      }
    }

    transformNodes(child);
    return child;
  });
}

export default function embedMediaRemark() {
  return (tree) => transformNodes(tree);
}