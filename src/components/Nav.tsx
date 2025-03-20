import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface NavItem {
  name: string
  path: string
  icon?: string
}

interface ThemeToggleProps {
  className?: string
}

// 主題切換按鈕組件
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // 初始化主題
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')

    setTheme(initialTheme)
    applyTheme(initialTheme)

    // 監聽系統主題變化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light'
        setTheme(newTheme)
        applyTheme(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 應用主題
  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', newTheme)
  }

  // 切換主題
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="切換深色模式"
      className={`theme-toggle ${className}`}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  )
}

// 主導航欄組件
const Nav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('/')
  const [dimensions, setDimensions] = useState({
    left: 0,
    width: 0,
    top: 0,
    height: 0,
  })
  const navRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const [isClient, setIsClient] = useState(false)

  // 導航項目數據
  const navItems: NavItem[] = [
    { name: '首頁', path: '/' },
    { name: '專案', path: '/projects' },
    { name: '關於', path: '/about' },
    { name: '聯絡', path: '/contact' },
  ]

  // 當組件掛載時，設置為客戶端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 找到當前活動的 tab 並設置外框位置
  useEffect(() => {
    if (!isClient) return

    const updateActiveTab = () => {
      const currentPath = window.location.pathname

      // 找到匹配的導航項
      const activeItem = navItems.find(
        (item) =>
          currentPath === item.path ||
          (item.path !== '/' && currentPath.startsWith(item.path))
      )

      if (activeItem) {
        setActiveTab(activeItem.path)
        const element = navRefs.current.get(activeItem.path)

        if (element) {
          const rect = element.getBoundingClientRect()
          const parentRect =
            element.parentElement?.parentElement?.getBoundingClientRect() || {
              left: 0,
              top: 0,
            }

          setDimensions({
            left: rect.left - parentRect.left,
            width: rect.width,
            top: rect.height + 2, // 設置外框在底部位置
            height: 2, // 外框高度
          })
        }
      }
    }

    // 初始更新
    updateActiveTab()

    // 監聽 Astro 頁面切換事件
    const handlePageLoad = () => {
      setTimeout(updateActiveTab, 0)
    }

    document.addEventListener('astro:page-load', handlePageLoad)

    // 窗口尺寸變化時重新計算
    window.addEventListener('resize', updateActiveTab)

    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad)
      window.removeEventListener('resize', updateActiveTab)
    }
  }, [isClient, navItems])

  // 設置 ref 回調函數
  const setNavRef = (el: HTMLAnchorElement | null, path: string) => {
    if (el) {
      navRefs.current.set(path, el)
    } else {
      navRefs.current.delete(path)
    }
  }

  // 如果不是客戶端渲染，返回靜態 HTML
  if (!isClient) {
    return (
      <nav className="w-full bg-background/80 backdrop-blur-sm shadow-sm dark:shadow-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <a
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
          </a>
          <div className="flex items-center gap-6">
            <ul className="flex gap-6 items-center">
              {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className="px-3 py-2 text-text hover:text-text-secondary transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="theme-toggle"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="w-full bg-background/80 backdrop-blur-sm shadow-sm dark:shadow-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <a
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
        </a>

        <div className="flex items-center gap-6">
          <div className="relative">
            <ul className="flex gap-6 items-center">
              {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    ref={(el) => setNavRef(el, item.path)}
                    href={item.path}
                    className={`block px-3 py-2 relative z-10 text-text hover:text-text-secondary transition-colors ${
                      activeTab === item.path ? 'text-primary font-medium' : ''
                    }`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* 滑動外框 */}
            <motion.div
              className="absolute bottom-0 bg-primary rounded-full z-0"
              initial={false}
              animate={{
                left: dimensions.left,
                width: dimensions.width,
                top: dimensions.top,
                height: dimensions.height,
              }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
              }}
            />
          </div>
        </div>

        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Nav
