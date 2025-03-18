import { defineConfig, presetUno, presetTypography, presetWebFonts, presetIcons, transformerVariantGroup, transformerDirectives } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Atkinson Hyperlegible',
      },
    }),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  theme: {
    colors: {
      primary: {
        DEFAULT: 'var(--color-primary)',
        dark: 'var(--color-primary-dark)',
      },
      background: {
        DEFAULT: 'var(--color-background)',
        secondary: 'var(--color-background-secondary)',
      },
      text: {
        DEFAULT: 'var(--color-text)',
        secondary: 'var(--color-text-secondary)',
      }
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg transition-colors duration-200',
    'btn-primary': 'bg-primary text-white hover:bg-primary-dark',
    'btn-secondary': 'bg-background-secondary text-text hover:bg-gray-300 dark:hover:bg-gray-700',
    'card': 'bg-background-secondary rounded-lg p-4 shadow-md',
    'input': 'px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-background text-text',
    'container': 'max-w-7xl mx-auto px-4',
  },
  rules: [
    ['text-shadow', { 'text-shadow': '0 2px 4px rgba(0,0,0,0.1)' }],
    ['text-shadow-lg', { 'text-shadow': '0 4px 8px rgba(0,0,0,0.2)' }],
    [/^glass-(.+)$/, ([, opacity]) => {
      return {
        'backdrop-filter': 'blur(10px)',
        'background-color': `rgba(255, 255, 255, ${opacity || 0.1})`,
        'dark:background-color': `rgba(0, 0, 0, ${opacity || 0.1})`
      }
    }],
  ],
})