// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    {
        files: ['**/*.{js,ts}'],
        extends: [...tseslint.configs.recommended],
        rules: {},
    },
    {
        plugins: { prettier },
        rules: {
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                },
            ],
        },
    }
);
