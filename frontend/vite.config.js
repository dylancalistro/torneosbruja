import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Demo en GitHub Pages: sirve desde /torneosbruja/. Al mudar a un dominio propio, volver a '/'.
  base: '/torneosbruja/',
})
