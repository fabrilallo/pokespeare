module.exports = {
  parserOptions: {
      project: "./tsconfig.json",
  },
  extends: [
      "./.eslintrc.js",
      "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ]
};
