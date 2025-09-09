import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@app', replacement: path.resolve(__dirname, 'src/app') },
      { find: '@core', replacement: path.resolve(__dirname, 'src/core') },
      { find: '@shared', replacement: path.resolve(__dirname, 'src/shared') },
      { find: '@features', replacement: path.resolve(__dirname, 'src/features') },
      { find: '@theme', replacement: path.resolve(__dirname, 'src/theme') },
      { find: '@store', replacement: path.resolve(__dirname, 'src/store') },
      { find: '@styles', replacement: path.resolve(__dirname, 'src/styles') },
    ],
  },

})
