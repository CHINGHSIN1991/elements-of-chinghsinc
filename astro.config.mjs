// @ts-check
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import UnoCSS from 'unocss/astro'

const LOCAL_URL = 'http://localhost:4321'
// Served at the subdomain root via public/CNAME, so no `base` is needed.
const LIVE_URL = 'https://blog.chinghsinchen.com'
const isBuild = process.env.NODE_ENV === 'production'

const url = isBuild ? LIVE_URL : LOCAL_URL

export default defineConfig({
  output: 'static',
  site: url,
  integrations: [
    icon(),
    UnoCSS({
      injectReset: true,
    }),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: ['sharp'],
      }
    },
  },
})
