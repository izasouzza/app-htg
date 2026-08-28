import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // O GitHub Pages serve em subpasta (/app-htg/). O build do Capacitor e o da
  // Hostinger continuam na raiz, então o padrão é '/'.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: {
    // permite abrir o app pelo celular na mesma rede Wi-Fi durante o desenvolvimento
    host: true,
  },
})
