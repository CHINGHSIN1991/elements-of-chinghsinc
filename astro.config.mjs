// @ts-check
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import UnoCSS from 'unocss/astro'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [
    icon(),
    UnoCSS({
      injectReset: true,
    }),
    react(),
  ],
})
