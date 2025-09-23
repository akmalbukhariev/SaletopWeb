module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: undefined,
  },
  env: { browser: true, es2021: true, node: true },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'jsx-a11y',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {},
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    },
  },
  rules: {
    'prettier/prettier': 'warn',
    'react/react-in-jsx-scope': 'off',
    'import/no-unresolved': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignorePatterns: ['dist', 'build', 'node_modules'],
}

