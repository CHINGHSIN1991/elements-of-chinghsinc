# Elements of ChingHsinChen

A personal portfolio and blog built with [Astro](https://astro.build), featuring an interactive Three.js hero, dark mode, and a fully static, SEO-friendly output.

**Live site**: [blog.chinghsinchen.com](https://blog.chinghsinchen.com)

## 🌟 Features

### 📝 Blog System
- **Markdown Content**: Blog posts written in Markdown with type-safe frontmatter (Astro Content Collections + Zod)
- **Categories & Tags**: Browse posts by category or tag, with dedicated listing pages
- **Related Posts**: Automatic related content suggestions by shared category/tags
- **Table of Contents**: Auto-generated navigation for long articles
- **Draft Support**: Mark posts as `draft` to exclude them from the published site

### 🎨 Project Showcase
- **Project Gallery**: Portfolio projects defined as JSON with rich metadata (cover, image gallery, designers)
- **Category & Tag Filtering**: Same discovery system as the blog
- **Project Details**: Dedicated pages with image galleries and project info

### 🎯 User Experience
- **Interactive Hero**: Three.js scene carousel on the homepage with swipe/drag gestures and auto-rotation
- **Dark/Light Mode**: Theme toggle with persistent preference
- **View Transitions**: Smooth client-side navigation via Astro's `<ClientRouter />`
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **SEO**: Meta tags, Open Graph, Twitter Cards, JSON-LD, plus generated `rss.xml`, `sitemap.xml`, and `robots.txt`

### 🏗️ Technical
- **Astro 6** static site generation — zero JS by default, islands where needed
- **TypeScript** throughout, verified with `astro check`
- **UnoCSS** atomic CSS engine for styling
- **Content Collections** with Zod schemas for posts, projects, and static content (education, work experience, skills, contact)

## 📁 Project Structure

```
src/
├── components/
│   ├── blog/             # PostCard
│   ├── project/          # ProjectCard, ProjectInfo
│   ├── layout/           # NavBar, Footer, PostHeader, Seo
│   └── common/           # CategoryList, LatestItems, RelatedItems,
│                         # TagClout, TagList, Pagination, ThemeToggle, ...
├── content/
│   ├── posts/            # Blog posts (Markdown)
│   ├── projects/         # Project data (JSON)
│   └── static/           # Structured data: education, work, skills, contact
├── layouts/              # MainLayout, PostLayout
├── pages/
│   ├── blog/             # Paginated list, post pages, category/tag pages
│   ├── project/          # Paginated list, project pages, category/tag pages
│   ├── _templates/       # Shared page templates (PaginatedList, CategoryPage)
│   ├── rss.xml.ts        # RSS feed
│   ├── sitemap.xml.ts    # Sitemap
│   └── robots.txt.ts     # Robots
├── styles/               # theme.css, components.css
├── ts/                   # three-hero, utils, jsonLD, scroll-utils, siteUrl
├── data/                 # navdata.ts, siteData.json
└── content.config.ts     # Content collection schemas (Zod)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 22 (pinned via [Volta](https://volta.sh))
- npm

### Installation

```bash
git clone https://github.com/CHINGHSIN1991/elements-of-chinghsinc.git
cd elements-of-chinghsinc
npm install
npm run dev
```

Then open `http://localhost:4321`.

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run check` | Type-check with `astro check` |
| `npm run images:placeholders` | Generate placeholder images |
| `npm run deploy` | Build and prepare `dist/` for GitHub Pages |

## 📝 Content Management

### Adding Blog Posts

Create a new `.md` file in `src/content/posts/` with frontmatter:

```yaml
---
title: "Your Post Title"
description: "Brief description"
date: 2026-01-01
category: "Technology"
tags: ["astro", "web-development"]
image:
  src: "/images/cover.jpg"
  alt: "Cover image"
author: "Optional Author"   # optional
draft: false                # optional, defaults to false
---
```

### Adding Projects

Create a new `.json` file in `src/content/projects/`:

```json
{
  "title": "Project Name",
  "description": "Project description",
  "date": "2026-01-01",
  "category": "Web Development",
  "tags": ["UI/UX", "TypeScript"],
  "designers": ["Name"],
  "cover": "/images/cover.jpg",
  "images": [
    { "src": "/images/detail.jpg", "description": "Optional caption" }
  ],
  "draft": false
}
```

Schemas are enforced by Zod in [src/content.config.ts](src/content.config.ts) — invalid frontmatter fails the build.

## 🎨 Customization

- **Theme**: `src/styles/theme.css` for color schemes and CSS variables
- **Site settings**: `src/data/siteData.json` (title, description, default image)
- **Navigation**: `src/data/navdata.ts`
- **Layouts**: `src/layouts/MainLayout.astro`, `src/layouts/PostLayout.astro`

## 🚀 Deployment

Deployed to **GitHub Pages** with a custom domain:

- Pushes to `main` trigger [.github/workflows/deploy.yml](.github/workflows/deploy.yml) (`withastro/action`)
- The custom domain is configured via `public/CNAME` → [blog.chinghsinchen.com](https://blog.chinghsinchen.com)
- `astro.config.mjs` uses the live URL as `site` for canonical URLs, RSS, and sitemap during builds

## 📚 Tech Stack

- **[Astro](https://astro.build)** — Static site generator
- **[TypeScript](https://www.typescriptlang.org/)** — Type safety
- **[UnoCSS](https://unocss.dev/)** — Atomic CSS engine
- **[Three.js](https://threejs.org/)** — Interactive homepage hero
- **[astro-icon](https://github.com/natemoo-re/astro-icon)** — Icon components

## 📞 Contact

- **Website**: [blog.chinghsinchen.com](https://blog.chinghsinchen.com)
- **GitHub**: [@CHINGHSIN1991](https://github.com/CHINGHSIN1991)
