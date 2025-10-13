import siteData from "../data/siteData.json"
import { slugify } from "./utils";

interface PostParam {
  type: string,
  post: any, // TODO FIX TYPE
  url: string,
}

const getAbsoluteUrl = (value: string | undefined, base: string | undefined) => {
  if (!value) return undefined
  if (/^https?:/i.test(value)) return value

  if (!base) return value

  try {
    return new URL(value, base).href
  } catch {
    return value
  }
}

export default function jsonLDGenerator({ type, post, url }: PostParam) {
  const siteUrl = import.meta.env.SITE || url
  const language = siteData.locale || "en_US"

  if (type === 'post' && post) {
    const postData = typeof post === 'object' && 'data' in post ? post.data : post
    const designers = Array.isArray(postData?.designers)
      ? postData.designers
      : Array.isArray(post?.designers)
        ? post.designers
        : []
    const authorName = postData?.author || designers?.[0] || siteData.author
    const coverSrc = getAbsoluteUrl(
      typeof postData?.cover === 'string'
        ? postData.cover
        : postData?.cover?.src || postData?.image?.src || post?.image?.src,
      siteUrl
    )

    const articleJson: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url,
      },
      headline: postData?.title || post?.title || siteData.title,
      description: postData?.description || post?.description || siteData.description,
      inLanguage: language,
      url,
    }

    if (coverSrc) {
      articleJson.image = [coverSrc]
    }

    if (authorName) {
      articleJson.author = {
        "@type": "Person",
        name: authorName,
      }
      articleJson.creator = {
        "@type": "Person",
        name: authorName,
      }
    }

    if (designers.length > 0) {
      articleJson.contributor = designers.map((designer: string) => ({
        "@type": "Person",
        name: designer,
        url: `/designer/${slugify(designer)}`,
      }))
    }

    const publishedDate = postData?.date || post?.date
    if (publishedDate) {
      articleJson.datePublished = publishedDate
    }

    if (siteData.author) {
      articleJson.publisher = {
        "@type": "Person",
        name: siteData.author,
      }
    }

    return `<script type="application/ld+json">${JSON.stringify(articleJson)}</script>`
  }

  const websiteJson: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteData.title,
    url: siteUrl,
    description: siteData.description,
    inLanguage: language,
  }

  if (Array.isArray(siteData.sameAs) && siteData.sameAs.length > 0) {
    websiteJson.sameAs = siteData.sameAs
  }

  if (siteData.author) {
    websiteJson.publisher = {
      "@type": "Person",
      name: siteData.author,
    }
  }

  return `<script type="application/ld+json">${JSON.stringify(websiteJson)}</script>`
}