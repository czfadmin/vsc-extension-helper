/**
 * @type {import("eslint").Linter.BaseConfig}
 */
module.exports = {
  root: true,
  extends: ['@modern-js'],
  rules: {
    'react-hooks/rules-of-hooks': 'off',
    'no-template-curly-in-string': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'off',
  },
};
