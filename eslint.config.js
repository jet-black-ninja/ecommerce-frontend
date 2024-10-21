import { createRequire } from "module"; // Import createRequire to load modules
const require = createRequire(import.meta.url); // Create a require function

// Import the TypeScript parser and plugins
const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const importPlugin = require('eslint-plugin-import');

export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: typescriptParser, // Use the imported TypeScript parser here
      ecmaVersion: 2020,         // Use the latest ECMAScript features
      sourceType: 'module',      // Allow the use of imports
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin, // Use the imported TypeScript plugin
      'react': reactPlugin,                      // Use the imported React plugin
      'jsx-a11y': jsxA11yPlugin,                // Use the imported JSX a11y plugin
      'import': importPlugin,                    // Use the imported import plugin
    },
    rules: {
      // Specify your project-specific rules here
      'react/react-in-jsx-scope': 'off',  // Not needed for Next.js projects
      '@typescript-eslint/explicit-function-return-type': 'off',  // Allow implicit return types
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],  // Ignore unused variables starting with _
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],  // Allow devDependencies in dev files
      'react/jsx-props-no-spreading': 'off',  // Allow prop spreading in JSX
      'jsx-a11y/anchor-is-valid': 'off',  // Next.js uses <a> in <Link> component
      'import/order': ['error', {         // Enforce import order
        groups: [['builtin', 'external', 'internal']],
        'newlines-between': 'always'
      }],
      'no-console': ['error', { allow: ['warn', 'error'] }] // Allow console warnings and errors
    },
    settings: {
      react: {
        version: 'detect',                // Automatically detect the version of React
      },
    },
  }
];
