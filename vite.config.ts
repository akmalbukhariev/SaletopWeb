import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import eslint from 'vite-plugin-eslint';

const root = process.cwd();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(root, 'src') },
      { find: '@app', replacement: path.resolve(root, 'src/app') },
      { find: '@core', replacement: path.resolve(root, 'src/core') },
      { find: '@shared', replacement: path.resolve(root, 'src/shared') },
      { find: '@features', replacement: path.resolve(root, 'src/features') },
      { find: '@theme', replacement: path.resolve(root, 'src/theme') },
      { find: '@store', replacement: path.resolve(root, 'src/store') },
      { find: '@styles', replacement: path.resolve(root, 'src/styles') },
    ],
  }
})
