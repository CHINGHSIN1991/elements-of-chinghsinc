import siteData from "../data/siteData.json"
import { slugify } from "./utils";

interface PostParam {
  type: string,
  post: any, // TODO FIX TYPE
  url: string,
}

export default function jsonLDGenerator({ type, post, url }: PostParam) {
  if (type === 'post') {
    return `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "${url}"
        },
        "headline": "${post.title}",
        "description": "${post.description}",
        "cover": "${post.cover.src}",
        "designer": {
          "@type": "Person",
          "name": "${post.designers[0]}",
          "url": "/designer/${slugify(post.designers[0])}"
        },
        "datePublished": "${post.date}"
      }
    </script>`;
  }
  return `<script type="application/ld+json">
      {
      "@context": "https://schema.org/",
      "@type": "WebSite",
      "name": "${siteData.title}",
      "url": "${import.meta.env.SITE}"
      }
    </script>`;
}