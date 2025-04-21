import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    host: '0.0.0.0', // O la IP específica que quieras
    port: 5173, // Puedes cambiarlo si es necesario
    strictPort: true, // Para asegurarte de que usa ese puerto
    allowedHosts: ['ec2-44-204-195-66.compute-1.amazonaws.com']
  }
})
