/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()], 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
  define: {
    // variables de entorno en tests
    'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify('test-google-client-id'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true, 
    restoreMocks: true, 
    clearMocks: true,   
    mockReset: true, 
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'], // 
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'src/main.tsx', // 
        'src/vite-env.d.ts', // 
      ],
    },
  },
});