/// <reference types="vitest" />

import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    base: '/',
    root: './local/',
    plugins: [
        // checker({ typescript: true, eslint: { lintCommand: 'eslint ./src' } }),
    ],
    server: {
        proxy: {
            '^(/fonts/)': {
                target: 'https://railmapgen.github.io',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    test: {
        globals: true,
        root: './src/',
        environment: 'jsdom',
        setupFiles: './setupTests.ts',
        watch: false,
        pool: 'forks',
    },
});
