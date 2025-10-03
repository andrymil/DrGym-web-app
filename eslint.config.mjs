import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const tsTypeAware = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: ['**/*.ts', '**/*.tsx'],
  languageOptions: {
    ...config.languageOptions,
    parser: tseslint.parser,
    parserOptions: {
      ...(config.languageOptions?.parserOptions ?? {}),
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
      sourceType: 'module',
    },
  },
}));

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'dist/**'] },

  ...compat.config({ extends: ['next/core-web-vitals'] }),

  js.configs.recommended,

  ...tsTypeAware,

  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  eslintPluginPrettierRecommended,
];

export default config;
