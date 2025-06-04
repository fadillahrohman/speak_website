import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),],

  
  server: {
    proxy: {
      // '/api' : 'http://localhost:3003' 
      '/api': {
        target: 'https://speak.rynn.fun',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
    
  }  
})
