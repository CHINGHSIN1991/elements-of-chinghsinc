export const locales = ['zh-tw', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh-tw';

export const ui = {
  'zh-tw': {
    common: {
      siteName: 'Elements of ChingHsinChen',
      siteDescription: '以細膩的態度結合設計、科技與邏輯思維，探索跨域創新的無限可能。',
      skipToContent: '跳到主要內容',
      languageNames: {
        'zh-tw': '繁中',
        en: 'EN'
      },
      languageSwitcher: {
        switchTo: '切換至 {language}',
        current: '{language}（目前）'
      },
      actions: {
        previous: '上一頁',
        next: '下一頁',
        backToTop: '回到頂端',
        scrollToBottom: '移至底部',
        expandAll: '展開全部',
        collapseAll: '收合全部',
        readMore: '閱讀更多',
        viewProject: '查看專案',
        returnHome: '返回首頁',
        sendMessage: '送出訊息',
        exploreMore: '探索更多',
        buyCoffee: '贊助一杯咖啡'
      },
      labels: {
        categories: '文章分類',
        projectCategories: '專案分類',
        tableOfContents: '目錄',
        articleInfo: '文章資訊',
        wordCount: '字數',
        sections: '段落',
        tags: '標籤',
        support: '贊助',
        projectInfo: '專案資訊',
        category: '分類',
        date: '日期',
        designers: '設計師',
        images: '圖片',
        email: '電子郵件',
        name: '姓名',
        subject: '主旨',
        message: '訊息',
        privacyAgreement: '我同意使用這些資訊回覆我的詢問 *',
        responseTime: '回覆時間：通常會在 24-48 小時內回覆，期待與你交流！',
        githubCta: '探索我的程式碼庫',
        linkedinCta: '查看專業履歷',
        aboutMe: '關於我',
        rss: '訂閱 RSS'
      },
      statuses: {
        underConstruction: '頁面建置中',
        workingOnImprovements: '持續優化中...'
      },
      empty: {
        posts: {
          title: '尚無文章',
          description: '目前尚未有任何文章，請稍後再查看。'
        },
        projects: {
          title: '尚無專案',
          description: '目前尚未有任何專案作品，請稍後再查看。'
        }
      },
      messages: {
        emailOpened: '✓ 已開啟電子郵件應用程式'
      },
      notFound: {
        meta: {
          title: '404 - 頁面未找到',
          description: '您尋找的頁面不存在或已被移除。'
        },
        heading: '頁面未找到',
        body: '您尋找的頁面似乎已消失在數字空間中...',
        cta: {
          home: '返回首頁',
          contact: '聯絡我們'
        },
        suggestions: {
          title: '您可能想要訪問：',
          projects: '查看我們的專案作品集',
          about: '了解更多關於我們'
        }
      }
    },
    nav: {
      about: '關於我',
      project: '專案',
      blog: '部落格',
      contact: '聯絡',
      themeToggle: '切換深色模式'
    },
    footer: {
      copyright: '版權所有 © {year} | 保留所有權利',
      subscribe: '訂閱 RSS'
    },
    home: {
      meta: {
        title: '晴昕的元素 - Elements of ChingHsinChen',
        description: '穿梭於設計、科技與邏輯思維之間，探索跨域創新的無限可能。'
      },
      hero: {
        title: [
          [
            { text: 'Elements ', accent: false },
            { text: 'of', accent: true }
          ],
          [
            { text: 'Ching Hsin', accent: true }
          ]
        ],
        subtitle: '充滿希望與機會的疆域',
        sections: ['章節一', '章節二', '章節三', '章節四'],
        years: {
          start: '1991',
          divider: '/',
          end: '9999'
        }
      },
      overview: {
        heading: '跨域創新',
        description: '結合理性思維、美學設計與技術創新，探索跨領域專業知識的無限可能。'
      },
      features: [
        {
          icon: '∑',
          title: '邏輯思維',
          description: '以數理邏輯為基礎，透過嚴謹的分析方法解決複雜問題，追求精準與效率的平衡。',
          meta: '數理邏輯｜問題解決'
        },
        {
          icon: '⌘',
          title: '設計美學',
          description: '致力於創造兼具功能與美感的設計，從空間規劃到使用者體驗皆全面思考。',
          meta: '美感設計｜使用者體驗'
        },
        {
          icon: '</>',
          title: '技術創新',
          description: '運用現代科技工具實現創意構想，不斷探索新技術與傳統設計理念的結合。',
          meta: '科技應用｜創意解決方案'
        }
      ],
      philosophy: {
        title: '核心理念',
        quote: '「一位追求創新解決方案的跨域學習者，對所有事物充滿好奇；熱衷於結合不同專業的知識，創造獨一無二的價值。」'
      }
    },
    about: {
      meta: {
        title: '關於我 - Elements of ChingHsinChen',
        description: '了解我的教育背景與跨領域經歷。'
      },
      heading: '關於我',
      educationHeading: '教育經歷',
      experienceHeading: '工作經歷'
    },
    contact: {
      meta: {
        title: '聯絡我 - Elements of ChingHsinChen',
        description: '歡迎聯繫我，探索合作與交流的更多可能。'
      },
      overlay: {
        title: '建置中',
        message: '此頁面正在更新中，將帶給你更好的體驗，敬請期待！',
        status: '持續優化中...'
      },
      hero: {
        title: '聯絡',
        subtitle: '歡迎一同討論合作可能、創新專案，或分享關於設計與科技的洞見。'
      },
      main: {
        heading: '讓我們保持聯繫',
        description: '準備好合作、交流創新想法，或一同探索新的可能性。'
      },
      about: {
        title: '關於我'
      },
      methods: {
        email: {
          title: '電子郵件',
          description: '直達信箱的最佳管道'
        },
        github: {
          title: 'GitHub',
          description: '探索我的程式碼庫'
        },
        linkedin: {
          title: 'LinkedIn',
          description: '專業履歷與經歷'
        }
      },
      form: {
        title: '傳送訊息',
        nameLabel: '姓名 *',
        emailLabel: '電子郵件 *',
        subjectLabel: '主旨 *',
        messageLabel: '訊息 *',
        namePlaceholder: '您的姓名',
        emailPlaceholder: 'your@email.com',
        subjectPlaceholder: '想討論的主題',
        messagePlaceholder: '想與我分享的想法...',
        privacy: '我同意使用這些資訊回覆我的詢問 *',
        submit: '送出訊息',
        success: '✓ 已開啟電子郵件應用程式'
      },
      responseTime: '回覆時間：通常會在 24-48 小時內回覆，期待與你交流！',
      cta: {
        title: '探索更多',
        description: '歡迎閱讀我對設計與科技的觀點，或瀏覽充滿創意的專案作品。',
        blogTitle: '閱讀文章',
        blogDescription: '設計與科技的觀點',
        projectTitle: '查看專案',
        projectDescription: '創新專案作品集'
      }
    },
    blog: {
      list: {
        title: '部落格文章',
        description: '探索我對設計與科技的觀點與洞察。'
      },
      sidebar: {
        categories: '文章分類',
        popular: '熱門文章'
      },
      post: {
        tableOfContents: '目錄',
        backToTop: '回到頂端',
        expandAll: '展開全部',
        collapseAll: '收合全部',
        scrollToBottom: '移至底部',
        articleInfo: '文章資訊',
        wordCount: '字數',
        sections: '段落',
        tags: '標籤'
      },
      relatedItemsTitle: '相關文章',
      tag: {
        title: '#{tag} 的文章',
        description: '查看所有包含 #{tag} 標籤的文章',
        ariaLabel: '標籤文章列表',
        emptyTitle: '尚無文章',
        emptyDescription: '目前找不到包含此標籤的文章。',
        allPosts: '所有文章',
        returnHome: '返回首頁'
      },
      category: {
        title: '{category} 文章',
        description: '查看所有 {category} 分類的文章',
        ariaLabel: '文章分類列表',
        allLabel: '所有文章'
      }
    },
    project: {
      sidebar: {
        categories: '專案分類',
        popular: '熱門專案'
      },
      list: {
        title: '案例作品',
        description: '瀏覽跨領域創新的專案作品與案例分析。'
      },
      relatedItemsTitle: '相關專案',
      detail: {
        descriptionHeading: '專案介紹',
        tagsHeading: '標籤',
        imagesHeading: '專案圖片'
      },
      info: {
        title: '專案資訊',
        category: '分類',
        date: '日期',
        designers: '設計師',
        tags: '標籤',
        images: '圖片'
      },
      category: {
        title: '{category} 專案',
        description: '查看所有 {category} 分類的專案',
        ariaLabel: '專案分類列表',
        allLabel: '所有專案'
      },
      card: {
        cta: '查看專案'
      }
    }
  },
  en: {
    common: {
      siteName: 'Elements of ChingHsinChen',
      siteDescription: 'Exploring cross-disciplinary innovation by blending design, technology, and logical thinking with care.',
      skipToContent: 'Skip to main content',
      languageNames: {
        'zh-tw': 'ZH-TW',
        en: 'EN'
      },
      languageSwitcher: {
        switchTo: 'Switch to {language}',
        current: 'Current language: {language}'
      },
      actions: {
        previous: 'Previous',
        next: 'Next',
        backToTop: 'Back to Top',
        scrollToBottom: 'Scroll to Bottom',
        expandAll: 'Expand All',
        collapseAll: 'Collapse All',
        readMore: 'Read More',
        viewProject: 'View Project',
        returnHome: 'Return Home',
        sendMessage: 'Send Message',
        exploreMore: 'Explore More',
        buyCoffee: 'Buy Me a Coffee'
      },
      labels: {
        categories: 'Categories',
        projectCategories: 'Project Categories',
        tableOfContents: 'Table of Contents',
        articleInfo: 'Article Info',
        wordCount: 'Word Count',
        sections: 'Sections',
        tags: 'Tags',
        support: 'Support',
        projectInfo: 'Project Info',
        category: 'Category',
        date: 'Date',
        designers: 'Designers',
        images: 'Images',
        email: 'Email',
        name: 'Name',
        subject: 'Subject',
        message: 'Message',
        privacyAgreement: 'I agree to you using this information to reply to my inquiry *',
        responseTime: 'Response Time: I typically respond within 24-48 hours. Looking forward to connecting!',
        githubCta: 'Explore my repositories',
        linkedinCta: 'Professional profile & experience',
        aboutMe: 'About Me',
        rss: 'Subscribe to RSS'
      },
      statuses: {
        underConstruction: 'Under Construction',
        workingOnImprovements: 'Working on improvements...'
      },
      empty: {
        posts: {
          title: 'No posts yet',
          description: 'There are no posts to share just yet. Please check back soon.'
        },
        projects: {
          title: 'No projects yet',
          description: 'There are no project case studies to show yet. Please check back soon.'
        }
      },
      messages: {
        emailOpened: '✓ Email client opened'
      },
      notFound: {
        meta: {
          title: '404 - Page Not Found',
          description: 'The page you are looking for may have been moved or no longer exists.'
        },
        heading: 'Page Not Found',
        body: 'The page you are looking for seems to have slipped into the digital void...',
        cta: {
          home: 'Return Home',
          contact: 'Contact Me'
        },
        suggestions: {
          title: 'You might want to visit:',
          projects: 'Browse the project portfolio',
          about: 'Learn more about me'
        }
      }
    },
    nav: {
      about: 'About',
      project: 'Projects',
      blog: 'Blog',
      contact: 'Contact',
      themeToggle: 'Toggle dark mode'
    },
    footer: {
      copyright: 'Copyright © {year} | All rights reserved',
      subscribe: 'Subscribe to RSS'
    },
    home: {
      meta: {
        title: 'The New World - Elements of ChingHsinC',
        description: 'Exploring cross-disciplinary innovation that blends logic, design, and technology.'
      },
      hero: {
        title: [
          [
            { text: 'Elements ', accent: false },
            { text: 'of', accent: true }
          ],
          [
            { text: 'Ching Hsin', accent: true }
          ]
        ],
        subtitle: 'A Land of hope and opportunity',
        sections: ['Section 1', 'Section 2', 'Section 3', 'Section 4'],
        years: {
          start: '1991',
          divider: '/',
          end: '9999'
        }
      },
      overview: {
        heading: 'Cross-Disciplinary Innovation',
        description: 'Integrating logical thinking, aesthetic design, and technological innovation to explore the infinite possibilities of cross-disciplinary expertise.'
      },
      features: [
        {
          icon: '∑',
          title: 'Logical Thinking',
          description: 'Grounded in mathematical logic, applying rigorous analysis to solve complex problems and pursue the balance between precision and efficiency.',
          meta: 'Mathematical Logic | Problem Solving'
        },
        {
          icon: '⌘',
          title: 'Design Aesthetics',
          description: 'Committed to crafting designs that unite functionality and aesthetics, considering everything from spatial planning to user experience.',
          meta: 'Aesthetic Design | User Experience'
        },
        {
          icon: '</>',
          title: 'Technology Innovation',
          description: 'Leveraging modern technology to realise imaginative ideas and continuously explore how new tools merge with traditional design thinking.',
          meta: 'Technology Innovation | Creative Solutions'
        }
      ],
      philosophy: {
        title: 'Core Philosophy',
        quote: '"A cross-disciplinary learner who pursues innovative solutions and is curious about everything. A deep thinker passionate about combining knowledge from different fields to create unique value."'
      }
    },
    about: {
      meta: {
        title: 'About Me - Elements of ChingHsinC',
        description: 'Discover my academic background and cross-disciplinary experience.'
      },
      heading: 'About Me',
      educationHeading: 'Education',
      experienceHeading: 'Work Experience'
    },
    contact: {
      meta: {
        title: 'Contact - Elements of ChingHsinC',
        description: 'Connect with me to explore collaboration opportunities and share ideas.'
      },
      overlay: {
        title: 'Under Construction',
        message: 'This page is currently being updated to provide you with a better experience. Please check back soon!',
        status: 'Working on improvements...'
      },
      hero: {
        title: 'Contact',
        subtitle: "Let's connect to explore collaboration opportunities, discuss innovative projects, or share insights about design and technology."
      },
      main: {
        heading: "Let's Connect",
        description: 'Ready to collaborate, discuss innovative ideas, or explore new possibilities together.'
      },
      about: {
        title: 'About Me'
      },
      methods: {
        email: {
          title: 'Email',
          description: 'Best way to reach my inbox'
        },
        github: {
          title: 'GitHub',
          description: 'Explore my repositories'
        },
        linkedin: {
          title: 'LinkedIn',
          description: 'Professional profile & experience'
        }
      },
      form: {
        title: 'Send Message',
        nameLabel: 'Name *',
        emailLabel: 'Email *',
        subjectLabel: 'Subject *',
        messageLabel: 'Message *',
        namePlaceholder: 'Your name',
        emailPlaceholder: 'your@email.com',
        subjectPlaceholder: 'Message subject',
        messagePlaceholder: 'What would you like to discuss...',
        privacy: 'I agree to you using this information to reply to my inquiry *',
        submit: 'Send Message',
        success: '✓ Email client opened'
      },
      responseTime: 'Response Time: I typically respond within 24-48 hours. Looking forward to connecting!',
      cta: {
        title: 'Explore More',
        description: 'Discover my thoughts on design and technology, or browse through my portfolio of innovative projects.',
        blogTitle: 'Read Articles',
        blogDescription: 'Insights on design & technology',
        projectTitle: 'View Projects',
        projectDescription: 'Portfolio of innovative work'
      }
    },
    blog: {
      list: {
        title: 'Blog Posts',
        description: 'Discover my perspectives and insights on design and technology.'
      },
      sidebar: {
        categories: 'Categories',
        popular: 'Popular Posts'
      },
      post: {
        tableOfContents: 'Table of Contents',
        backToTop: 'Back to Top',
        expandAll: 'Expand All',
        collapseAll: 'Collapse All',
        scrollToBottom: 'Scroll to Bottom',
        articleInfo: 'Article Info',
        wordCount: 'Word Count',
        sections: 'Sections',
        tags: 'Tags'
      },
      relatedItemsTitle: 'Related Posts',
      tag: {
        title: 'Articles tagged #{tag}',
        description: 'Browse every post that includes the #{tag} tag',
        ariaLabel: 'Tag article list',
        emptyTitle: 'No posts yet',
        emptyDescription: "We couldn't find any posts with this tag just yet.",
        allPosts: 'All Posts',
        returnHome: 'Return Home'
      },
      category: {
        title: 'Articles in {category}',
        description: 'Browse every article filed under {category}',
        ariaLabel: 'Article category list',
        allLabel: 'All Posts'
      }
    },
    project: {
      sidebar: {
        categories: 'Project Categories',
        popular: 'Popular Projects'
      },
      list: {
        title: 'Project Showcase',
        description: 'Explore cross-disciplinary project showcases and case studies.'
      },
      relatedItemsTitle: 'Related Projects',
      detail: {
        descriptionHeading: 'Project Description',
        tagsHeading: 'Tags',
        imagesHeading: 'Project Images'
      },
      info: {
        title: 'Project Info',
        category: 'Category',
        date: 'Date',
        designers: 'Designers',
        tags: 'Tags',
        images: 'Images'
      },
      category: {
        title: 'Projects in {category}',
        description: 'Browse every project filed under {category}',
        ariaLabel: 'Project category list',
        allLabel: 'All Projects'
      },
      card: {
        cta: 'View Project'
      }
    }
  }
} as const;

export type UIDictionary = typeof ui;
