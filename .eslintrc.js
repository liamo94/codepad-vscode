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
