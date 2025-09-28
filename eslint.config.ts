import globals from "globals"
import tseslint from "typescript-eslint"

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
    rules: {
      "typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "typescript-eslint/no-explicit-any": 'off',
      "no-undef": "error",
      semi: ['error', 'never'],
      "no-console": "off",
      "indent": ["error", 2, { "SwitchCase": 1 }],
      'no-multi-spaces': [2, { ignoreEOLComments: true }],
      'prefer-const': 2,
      'no-useless-escape': 0,
      'no-dupe-keys': 2,
      'no-duplicate-case': 2,
      'new-parens': 2,
      'object-curly-spacing': ["error", "always", { "objectsInObjects": true }],
      'comma-spacing': ["error", { "before": false, "after": true }],
      'arrow-spacing': ["error", { "before": true, "after": true }],
      'space-infix-ops': "error",
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]
