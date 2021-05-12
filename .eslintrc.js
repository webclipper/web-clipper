module.exports = {
  extends: ['@diamondyuan/react-typescript', 'prettier'],
  plugins: ['eslint-plugin-prettier'],
  rules: {
    'no-use-before-define': 'off',
    'arrow-body-style': 'off',
    'no-redeclare': 'off',
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
