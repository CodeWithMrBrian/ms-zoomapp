import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // HTTPS required for Zoom Apps SDK
  ],
  server: {
    host: true, // Allow external connections
    port: 5173,
    // https: true, // Commented out for now - can be enabled with proper cert config
    cors: {
      origin: ['https://zoom.us', 'https://*.zoom.us'],
      credentials: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'zoom-sdk': ['@zoom/appssdk']
        }
      }
    }
  }
})
