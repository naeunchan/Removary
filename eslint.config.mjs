import expoConfig from 'eslint-config-expo/flat.js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.expo/**',
      '**/dist/**',
      '**/build/**',
      'package-lock.json',
    ],
  },
  ...expoConfig,
  prettierRecommended,
];
