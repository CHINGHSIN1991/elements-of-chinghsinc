# Elements of ChingHsinChen

A personal portfolio and blog website built with Astro, featuring a modern design with dark mode support and responsive layout.

## 🌟 Features

### 📝 Blog System
- **Markdown Support**: Write blog posts in Markdown with frontmatter
- **Category Organization**: Organize posts by categories
- **Tag System**: Tag-based content discovery
- **Related Posts**: Automatic related content suggestions
- **Table of Contents**: Auto-generated navigation for long articles
- **Article Statistics**: Word count, paragraph count, and tag information

### 🎨 Project Showcase
- **Project Gallery**: Display portfolio projects with rich metadata
- **Category Filtering**: Filter projects by technology or type
- **Project Details**: Detailed project pages with descriptions and links
- **Related Projects**: Smart project recommendations

### 🎯 User Experience
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Navigation**: Client-side routing with Astro transitions
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, and JSON-LD
- **Performance**: Fast loading with static site generation

### 🏗️ Technical Features
- **Component Architecture**: Modular, reusable components organized by functionality
- **TypeScript Support**: Full type safety throughout the codebase
- **Tailwind CSS**: Utility-first styling with custom design system
- **Content Collections**: Type-safe content management with Astro
- **Image Optimization**: Automatic image processing and optimization

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── blog/           # Blog-specific components
│   │   ├── PostCard.astro
│   │   └── PopularPosts.astro
│   ├── project/        # Project-specific components
│   │   ├── ProjectCard.astro
│   │   └── PopularProjects.astro
│   ├── layout/         # Layout and structural components
│   │   ├── NavBar.astro
│   │   ├── Footer.astro
│   │   ├── PostHeader.astro
│   │   └── Seo.astro
│   └── common/         # Shared utility components
│       ├── CategoryList.astro
│       ├── Link.astro
│       ├── Pagination.astro
│       ├── ThemeToggle.astro
│       ├── TagClout.astro
│       └── RelatedItems.astro
├── content/            # Content management
│   ├── posts/         # Blog posts (Markdown)
│   ├── projects/      # Project data (JSON)
│   └── static/        # Static content data
├── layouts/           # Page layouts
├── pages/            # Route pages
├── styles/           # Global styles and themes
├── ts/               # TypeScript utilities
└── data/             # Site configuration and navigation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/elements-of-chinghsinc.git
   cd elements-of-chinghsinc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:4321`

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run astro check` | Type-check your code |
| `npm run astro sync` | Sync content collections |

## 📝 Content Management

### Adding Blog Posts
1. Create a new `.md` file in `src/content/posts/`
2. Add frontmatter with required fields:
   ```yaml
   ---
   title: "Your Post Title"
   description: "Brief description"
   date: 2025-01-01
   author: "Your Name"
   category: "Technology"
   tags: ["astro", "web-development"]
   ---
   ```
3. Write your content in Markdown

### Adding Projects
1. Create a new `.json` file in `src/content/projects/`
2. Add project metadata:
   ```json
   {
     "title": "Project Name",
     "description": "Project description",
     "date": "2025-01-01",
     "category": "Web Development",
     "technologies": ["React", "TypeScript"],
     "image": "/path/to/image.jpg",
     "url": "https://project-url.com"
   }
   ```

## 🎨 Customization

### Theme Configuration
- Edit `src/styles/theme.css` for color schemes and CSS variables
- Modify `src/data/siteData.json` for site-wide settings
- Update `src/data/navdata.ts` for navigation structure

### Component Styling
- Components use Tailwind CSS classes
- Custom styles can be added in component `<style>` blocks
- Global styles are in `src/styles/`

### Layout Customization
- Main layout: `src/layouts/MainLayout.astro`
- Blog post layout: `src/layouts/PostLayout.astro`

## 🔧 Configuration

### Site Settings
Edit `src/data/siteData.json`:
```json
{
  "title": "Your Site Title",
  "description": "Site description",
  "image": {
    "src": "/images/default.jpg",
    "alt": "Default image"
  }
}
```

### Navigation
Edit `src/data/navdata.ts`:
```typescript
export default [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "Projects", path: "/project" },
  { name: "About", path: "/about" }
];
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Connect your repository for automatic deployments
- **Vercel**: Import your project for seamless deployment
- **GitHub Pages**: Use GitHub Actions for deployment
- **Any Static Host**: Upload the `dist/` folder

## 📚 Tech Stack

- **[Astro](https://astro.build)** - Static site generator
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[UnoCSS](https://unocss.dev/)** - Atomic CSS engine
- **[Markdown](https://www.markdownguide.org/)** - Content authoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Astro](https://astro.build) for the amazing static site generator
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [UnoCSS](https://unocss.dev) for the atomic CSS engine

## 📞 Contact

- **Website**: [your-website.com](https://your-website.com)
- **Email**: your-email@example.com
- **GitHub**: [@yourusername](https://github.com/yourusername)

---

