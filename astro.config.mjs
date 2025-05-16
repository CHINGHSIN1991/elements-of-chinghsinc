// @ts-check
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'
import UnoCSS from 'unocss/astro'
import react from '@astrojs/react'

const LOCAL_URL = 'http://localhost:4321'
const LIVE_URL = 'https://chinghsin1991.github.io'
const REPO_NAME = 'elements-of-chinghsinc'
const SCRIPT = process.env.npm_lifecycle_script || ''
const isBuild = SCRIPT.includes('astro build')

let url = LOCAL_URL
let base = '/'
if (isBuild) {
  url = `${LIVE_URL}/${REPO_NAME}`
  base = `/${REPO_NAME}/`
}

export default defineConfig({
  output: 'static',
  site: url,
  base: base,
  integrations: [
    icon(),
    UnoCSS({
      injectReset: true,
    }),
    react(),
  ],
})
