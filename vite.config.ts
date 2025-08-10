import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // If deploying to GitHub Pages at https://<user>.github.io/<repo>,
  // set base to '/<repo>/' (we'll override via env in the action)
  base: process.env.VITE_BASE || '/'
})
