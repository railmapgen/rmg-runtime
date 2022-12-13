import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    base: '/',
    root: './local/',
    plugins: [
        // checker({ typescript: true, eslint: { lintCommand: 'eslint ./src' } }),
    ],
});
