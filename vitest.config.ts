/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        exclude: ['.git*', 'docs', 'examples', 'node_modules', 'coverage', 'dist', '**/index.ts'],
        alias: {
            '@/*': ['./src/$1']
        },
        environment: 'jsdom',
        coverage: {
            thresholds: {
                lines: 70,
                functions: 70,
                statements: 70,
                branches: 70
            }
        },
        clearMocks: true,
        mockReset: true,
        restoreMocks: true,
        setupFiles: ['vitest.setup.ts']
    }
});
