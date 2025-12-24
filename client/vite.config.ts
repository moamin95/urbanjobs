import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/jobs': {
        target: 'https://urbanjobs.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/categories': {
        target: 'https://urbanjobs.onrender.com',
        changeOrigin: true,
        secure: false,
      },
      '/agencies': {
        target: 'https://urbanjobs.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
