module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended", // 🔑 Prettier ESLint bilan integratsiya
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error", // Prettier xatolarini ESLint xato qiladi
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
