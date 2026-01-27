/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    // Exclude Playwright E2E tests - they use .spec.ts extension
    // which conflicts with Vitest's default pattern
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/e2e/**',
      'e2e/**',
    ],
  },
})