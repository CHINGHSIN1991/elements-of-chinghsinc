// @ts-check
import { defineConfig } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import icon from 'astro-icon'
import UnoCSS from 'unocss/astro'
import react from '@astrojs/react'

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    icon(),
    UnoCSS({
      injectReset: true,
    }),
    react(),
  ],
})
