import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // '@/assets': '/src/__mocks__/fileMock.js'  // mock all assets in this directory
    }
  }
})
