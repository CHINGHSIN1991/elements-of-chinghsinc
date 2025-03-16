import { defineConfig, presetUno, presetTypography } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetTypography(),
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
    }
  }
})