module.exports = {
  extends: [
    '@diamondyuan/react-typescript',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
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
