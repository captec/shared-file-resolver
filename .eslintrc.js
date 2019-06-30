"use strict";

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["typescript", "import"],
  extends: [
    "@strv/node/v10",
    "@strv/node/style",
    "@strv/node/optional",
    "@strv/typescript",
    "@strv/typescript/style"
  ],

  settings: {
    "import/resolver": {
      typescript: {}
    }
  },

  rules: {}
};
