import { defineConfig } from 'vitest/config';

// https://vitest.dev/config/
export default defineConfig({
    test: {
        globals: true,
        root: './src/',
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        watch: false,
    },
});
