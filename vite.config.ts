import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/cashflow/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
