const jsExtensions = ['.js', '.json', '.mjs', '.es', '.node', '.jsx']
const tsExtensions = ['.ts', '.d.ts', '.tsx']
const extensions = [...jsExtensions, ...tsExtensions]

module.exports = {
  root: true,
  parserOptions: { sourceType: 'module' },
  extends: ['@strv/eslint-config-typescript', '@strv/eslint-config-typescript/style', 'prettier'],
  env: {
    browser: false,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      node: { extensions },
    },
  },
  rules: {
    // To prevent sending too many requests at the same time to services
    // we generally execute requests in a loop while waiting for every
    // request to finish before starting the next request.
    'no-await-in-loop': 'off',

    // No usable in older es versions
    'prefer-named-capture-group': 'off',
  },
}
