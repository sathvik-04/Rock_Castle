import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3456,
    open: false,
    allowedHosts: ['.trycloudflare.com']
  },
  preview: {
    port: 3456,
    allowedHosts: ['.trycloudflare.com']
  }
})
