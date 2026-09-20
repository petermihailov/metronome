import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  // Игнорируемые пути (бывший .eslintignore)
  {
    ignores: [
      '.npm_cache/',
      'node_modules/',
      'dist/',
      'dev-dist/',
      'webpack.config.js',
      'postcss.config.js',
    ],
  },
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  reactPlugin.configs.flat.recommended,
  ...tsPlugin.configs['flat/recommended'],
  prettier,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2021 },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/consistent-type-definitions': 'error',
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: ['block-like'],
          next: ['block-like', 'return', 'let', 'const'],
        },
      ],
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          groups: [['builtin', 'external'], ['internal', 'parent', 'sibling'], 'index'],
          'newlines-between': 'always',
          pathGroups: [{ group: 'sibling', pattern: './*.module.css', position: 'after' }],
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-sort-props': [
        'error',
        { callbacksLast: true, shorthandFirst: true, reservedFirst: true },
      ],
      'react/prop-types': 'off',
      // Разрешение модулей проверяет TypeScript; плагин не понимает exports в ESM-пакетах
      'import/no-unresolved': 'off',
    },
  },
]
