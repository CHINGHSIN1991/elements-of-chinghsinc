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
        light: 'var(--color-primary-light)',
      },
      background: {
        DEFAULT: 'var(--color-background)',
        secondary: 'var(--color-background-secondary)',
        tertiary: 'var(--color-background-tertiary)',
      },
      text: {
        DEFAULT: 'var(--color-text)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
      },
      border: {
        DEFAULT: 'var(--color-border)',
        dark: 'var(--color-border-dark)',
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
    'btn-secondary': 'bg-background-secondary text-text hover:bg-background-tertiary border border-border',
    'card': 'bg-background-secondary rounded-lg shadow-dark border border-border',
    'input': 'px-3 py-2 border border-border rounded-md bg-background text-text',
    'container': 'max-w-7xl mx-auto px-4',
    'label': 'bg-black/70 backdrop-blur-sm border border-gray-500 text-white rounded-full hover:bg-black/80 transition-colors text-xs font-medium',
  }, 
  rules: [
    ['text-shadow', { 'text-shadow': '0 2px 4px rgba(0,0,0,0.1)' }],
    ['text-shadow-lg', { 'text-shadow': '0 4px 8px rgba(0,0,0,0.2)' }],
    ['shadow-dark', { 'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)' }],
    ['shadow-dark-lg', { 'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' }],
    ['shadow-dark-xl', { 'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)' }],
    ['shadow-dark-2xl', { 'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 15px 15px -5px rgba(0, 0, 0, 0.5)' }],
    ['shadow-dark-glow', { 'box-shadow': '0 0 20px rgba(0, 0, 0, 0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)' }],
    ['shadow-dark-inner', { 'box-shadow': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.4)' }],
    [/^glass-(.+)$/, ([, opacity]) => {
      return {
        'backdrop-filter': 'blur(10px)',
        'background-color': `rgba(255, 255, 255, ${opacity || 0.1})`,
        'dark:background-color': `rgba(0, 0, 0, ${opacity || 0.1})`
      }
    }],
  ],
})