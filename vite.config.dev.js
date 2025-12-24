/* eslint-env node */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  plugins: [
    svgr(),
    react({
      fastRefresh: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(
        new URL('./src/components', import.meta.url),
      ),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@services': fileURLToPath(
        new URL('./src/shared/services', import.meta.url),
      ),
      '@shared': fileURLToPath(new URL('./src/shared', import.meta.url)),
      '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    host: 'localhost',
    open: true,
    strictPort: true,
    hmr: {
      port: 24678,
      overlay: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: false,
    target: 'es2020',
    rollupOptions: {
      output: {
        format: 'es',
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.APP_VERSION': JSON.stringify(pkg.version),
  },
  esbuild: {
    target: 'es2020',
  },
});
