import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc'
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    // Включаем глобальные переменные типа 'describe', 'it', 'expect'
    globals: true,
    // Эмуляция браузерной среды
    environment: 'jsdom',
    // Путь к файлу настройки (создадим его ниже)
    setupFiles: './src/setupTests.ts',
    // CSS модули будут обрабатываться корректно
    css: true,
  },

})
