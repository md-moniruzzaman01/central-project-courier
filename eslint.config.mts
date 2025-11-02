// eslint.config.mts
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup FlatCompat (optional, for legacy configs)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default defineConfig([
  // Optionally include legacy configs (like eslint:recommended)
  ...compat.config({
    extends: ['eslint:recommended'],
  }),

  // Include @typescript-eslint recommended configs
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'tests/**', // ✅ ignore test files
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/*.config.{js,ts,mjs,cjs,mts,cts}',
    ],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      prettier: eslintPluginPrettier,
    },

    rules: {
      ...prettier.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          ignoreRestSiblings: true,
        },
      ],
      'prefer-const': 'error',
      'no-console': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
]);
