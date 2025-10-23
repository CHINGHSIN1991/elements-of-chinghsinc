import siteData from "../data/siteData.json";
import navData from "../data/navdata";
import { slugify } from "./utils";
import { createAbsoluteUrl, getSiteBaseUrl } from "./siteUrl";

type StructuredType = "post" | "project" | "website";

interface StructuredParam {
  type: StructuredType;
  item: any;
  url: string;
}

const toIsoString = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const resolveAbsoluteUrl = (value?: string) =>
  value ? createAbsoluteUrl(value) ?? value : undefined;

const resolveCanonicalUrl = (url: string) =>
  /^https?:/i.test(url) ? url : resolveAbsoluteUrl(url) ?? url;

const getContentData = (item: any) =>
  typeof item === "object" && item && "data" in item ? item.data : item;

export default function jsonLDGenerator({ type, item, url }: StructuredParam) {
  const canonicalUrl = resolveCanonicalUrl(url);
  const siteBase = getSiteBaseUrl();
  const homepageUrl = resolveAbsoluteUrl("/") ?? siteBase ?? canonicalUrl;
  const language = siteData.locale || "en_US";

  const nodes: Record<string, unknown>[] = [];

  const contentData = getContentData(item);
  const isPost = type === "post" && contentData;
  const isProject = type === "project" && contentData;

  if ((isPost || isProject) && contentData) {
    const designers: string[] = Array.isArray(contentData?.designers)
      ? contentData.designers
      : Array.isArray(item?.designers)
        ? item.designers
        : [];

    const authorName =
      typeof contentData?.author === "string"
        ? contentData.author
        : designers[0] || siteData.author;

    const imageSource =
      typeof contentData?.cover === "string"
        ? contentData.cover
        : contentData?.cover?.src || contentData?.image?.src || item?.image?.src;

    const coverSrc = resolveAbsoluteUrl(imageSource);
    const publishedDate = toIsoString(contentData?.date || item?.date);
    const updatedDate = toIsoString(
      (contentData as any)?.updated || contentData?.date || item?.date
    );

    const contentJson: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": isPost ? "BlogPosting" : "CreativeWork",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      headline:
        contentData?.title || item?.title || siteData.title,
      description:
        contentData?.description || item?.description || siteData.description,
      inLanguage: language,
      url: canonicalUrl,
    };

    if (coverSrc) {
      contentJson.image = [coverSrc];
    }

    if (authorName) {
      const author = {
        "@type": "Person",
        name: authorName,
      };
      contentJson.author = author;
      contentJson.creator = author;
    }

    if (designers.length > 0) {
      contentJson.contributor = designers.map((designer: string) => ({
        "@type": "Person",
        name: designer,
        url: resolveAbsoluteUrl(`/designer/${slugify(designer)}`),
      }));
    }

    if (publishedDate) {
      if (isPost) {
        contentJson.datePublished = publishedDate;
      } else {
        contentJson.dateCreated = publishedDate;
        contentJson.datePublished = publishedDate;
      }
    }

    if (updatedDate) {
      contentJson.dateModified = updatedDate;
    }

    if (isPost && contentData?.category) {
      contentJson.articleSection = contentData.category;
    }

    if (Array.isArray(contentData?.tags) && contentData.tags.length > 0) {
      contentJson.keywords = contentData.tags;
    }

    if (siteData.author) {
      contentJson.publisher = {
        "@type": "Person",
        name: siteData.author,
      };
    }

    nodes.push(contentJson);

    const breadcrumbEntries: Array<{ name: string; url: string }> = [];

    if (homepageUrl) {
      breadcrumbEntries.push({ name: siteData.title, url: homepageUrl });
    }

    if (isPost) {
      const blogListUrl = resolveAbsoluteUrl("/blog");
      if (blogListUrl) {
        breadcrumbEntries.push({ name: "Blog", url: blogListUrl });
      }
      if (contentData?.category) {
        const categoryUrl = resolveAbsoluteUrl(
          `/blog/category/${slugify(contentData.category)}`
        );
        if (categoryUrl) {
          breadcrumbEntries.push({
            name: contentData.category,
            url: categoryUrl,
          });
        }
      }
    }

    if (isProject) {
      const projectListUrl = resolveAbsoluteUrl("/project");
      if (projectListUrl) {
        breadcrumbEntries.push({ name: "Projects", url: projectListUrl });
      }
      if (contentData?.category) {
        const categoryUrl = resolveAbsoluteUrl(
          `/project/category/${slugify(contentData.category)}`
        );
        if (categoryUrl) {
          breadcrumbEntries.push({
            name: contentData.category,
            url: categoryUrl,
          });
        }
      }
    }

    breadcrumbEntries.push({
      name: contentData?.title || item?.title || siteData.title,
      url: canonicalUrl,
    });

    if (breadcrumbEntries.length > 1) {
      nodes.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbEntries.map((entry, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: entry.name,
          item: entry.url,
        })),
      });
    }
  }

  const websiteUrl = homepageUrl || canonicalUrl;
  const websiteJson: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteData.title,
    url: websiteUrl,
    description: siteData.description,
    inLanguage: language,
  };

  if (Array.isArray(siteData.sameAs) && siteData.sameAs.length > 0) {
    websiteJson.sameAs = siteData.sameAs;
  }

  if (siteData.author) {
    websiteJson.publisher = {
      "@type": "Person",
      name: siteData.author,
    };
  }

  nodes.push(websiteJson);

  const navElements = navData
    .map((entry, index) => {
      const entryUrl = resolveAbsoluteUrl(entry.path);
      if (!entryUrl) return undefined;
      return {
        "@type": "SiteNavigationElement",
        position: index + 1,
        name: entry.name,
        url: entryUrl,
      };
    })
    .filter(Boolean) as Array<Record<string, unknown>>;

  if (navElements.length > 0) {
    nodes.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: navElements,
    });
  }

  if (siteData.author) {
    const personJson: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: siteData.author,
    };

    if (homepageUrl) {
      personJson.url = homepageUrl;
    }

    if (Array.isArray(siteData.sameAs) && siteData.sameAs.length > 0) {
      personJson.sameAs = siteData.sameAs;
    }

    nodes.push(personJson);
  }

  const payload = nodes.length === 1 ? nodes[0] : nodes;

  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}
