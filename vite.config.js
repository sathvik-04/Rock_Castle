import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
