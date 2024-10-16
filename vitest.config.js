// vitest.config.js
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    coverage: {
      provider: 'istanbul', // or 'c8'
      reporter: ['text', 'json', 'html'],
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/setupTests.ts'],
    },
  },
});
