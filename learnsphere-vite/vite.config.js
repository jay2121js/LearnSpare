import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,             // auto-open report in browser
      filename: 'stats.html', // bundle report
      gzipSize: true,
      brotliSize: true
    })
  ],
  base: '/', // Ensure relative paths for static assets

  server: {
    port: 3000,
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react'
            if (id.includes('chart.js')) return 'chart'
            if (id.includes('video.js') || id.includes('plyr')) return 'video'
            if (id.includes('framer-motion')) return 'motion'
            return 'vendor'
          }
        }
      }
    }
  }
})
