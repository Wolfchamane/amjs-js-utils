import path from 'node:path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(() => ({
    base: './',
    build: {
        outDir: path.resolve(__dirname, '..', '..', 'docs', 'examples', 'xhr'),
    }
}));
