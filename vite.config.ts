import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import eslint from "vite-plugin-eslint"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()], // error bo‘lsa ham server to‘xtamasin},
  base: "/admin-page/",
  resolve: {
    alias: {
      // Object notation o'rniga array notation ishlatish
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@theme": path.resolve(__dirname, "./src/theme"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['saletop.uz', 'www.saletop.uz', 'localhost', '127.0.0.1'],   // 👈 bu yerda domeningizni yozasiz
    strictPort: true,
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
      credentials: true,
    }
  },
})
