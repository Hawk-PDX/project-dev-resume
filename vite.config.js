import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.PORT) || 5173,
    host: '0.0.0.0',
  },
  preview: {
    port: parseInt(process.env.PORT) || 5173,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          // Split large dependencies into separate chunks
          ui: ['@heroicons/react', 'framer-motion'],
        },
      },
    },
  },
  // Handle API URL for production
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
})