import React, { useEffect, useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'

interface NavItem {
  name: string
  path: string
  icon?: string
}

const navItems: NavItem[] = [
  { name: 'Blog', path: '/blog' },
  { name: 'Project', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const Nav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('/')
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(null)
  // const [dimensions, setDimensions] = useState({
  //   left: 0,
  //   width: 0,
  //   top: 0,
  //   height: 0,
  // })
  const navRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const [isClient, setIsClient] = useState(false)

  // 找到當前活動的 tab 並設置外框位置
  useEffect(() => {
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
        setActiveTabIndex(navItems.indexOf(activeItem))
        const element = navRefs.current.get(activeItem.path)

        // if (element) {
        //   const rect = element.getBoundingClientRect()
        //   const parentRect =
        //     element.parentElement?.parentElement?.getBoundingClientRect() || {
        //       left: 0,
        //       top: 0,
        //     }

        //   setDimensions({
        //     left: rect.left - parentRect.left,
        //     width: rect.width,
        //     top: rect.height + 2, // 設置外框在底部位置
        //     height: 2, // 外框高度
        //   })
        // }
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
            <ul className="flex items-center">
              {navItems.map((item) => (
                <li key={item.path}>
                  <a
                    ref={(el) => setNavRef(el, item.path)}
                    href={item.path}
                    className={`w-[96px] text-center block px-3 py-1 relative z-10 text-text hover:text-text-secondary transition-colors ${
                      activeTab === item.path ? 'text-primary font-medium' : ''
                    }`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            {activeTabIndex !== null && (
              <div
                className={`absolute border-2 left-[${String(
                  96 * activeTabIndex
                )}px] border-white-500 w-[96px] transition-all duration-300`}
              ></div>
            )}
          </div>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Nav
