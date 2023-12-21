module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  rules: {
    curly: ["error", "multi-line"],
    "@typescript-eslint/no-unused-vars": "warn",
  },
  overrides: [
    {
      files: ["*.js"],
      parserOptions: {
        sourceType: "script",
      },
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
