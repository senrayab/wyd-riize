import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves this project from /wyd-riize/.
  base: '/wyd-riize/',
  plugins: [react()],
  build: { outDir: 'dist' },
})
