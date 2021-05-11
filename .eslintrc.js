module.exports = {
  extends: ['@diamondyuan/react-typescript', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-use-before-define': 'off',
    'arrow-body-style': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'prettier/prettier': 'error',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: './webpack/webpack.common.js',
      },
    },
  },
};
