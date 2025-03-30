import React, { useEffect, useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'

interface NavItem {
  name: string
  path: string
}

const navItems: NavItem[] = [
  { name: 'Blog', path: '/blog' },
  { name: 'Project', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

const NavBar: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState<number | null>(null)
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([])

  // 底線的位置和寬度
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  })

  // 當頁面加載或路徑變化時更新活動標籤
  useEffect(() => {
    const updateActiveTab = () => {
      const currentPath = window.location.pathname
      const index = navItems.findIndex(
        (item) =>
          currentPath === item.path || currentPath.startsWith(`${item.path}/`)
      )
      setActiveTabIndex(index >= 0 ? index : null)

      // 更新底線位置
      if (index >= 0 && navRefs.current[index]) {
        const activeTab = navRefs.current[index]
        if (activeTab) {
          const { offsetLeft, offsetWidth } = activeTab
          setIndicatorStyle({
            left: offsetLeft,
            width: offsetWidth,
            opacity: 1,
          })
        }
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }))
      }
    }

    // 初始更新
    updateActiveTab()

    // 監聽頁面變化
    document.addEventListener('astro:page-load', updateActiveTab)

    return () => {
      document.removeEventListener('astro:page-load', updateActiveTab)
    }
  }, [])

  return (
    <nav className="flex items-center justify-center p-2">
      <div className="flex items-center px-10 relative">
        <a
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
        </a>
        <div className="flex flex-col mx-[240px]">
          <ul className="flex items-center gap-4 py-2 relative">
            {navItems.map((item, index) => (
              <li key={item.path}>
                <a
                  ref={(el) => (navRefs.current[index] = el)}
                  href={item.path}
                  className={`block px-3 py-1 relative z-10 text-text hover:text-text-secondary transition-colors ${
                    activeTabIndex === index ? 'text-primary font-bold' : ''
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}

            {/* 底線指示器 */}
            <div
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
                height: '2px',
              }}
            />
          </ul>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default NavBar
