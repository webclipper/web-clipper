module.exports = {
  extends: [
    '@diamondyuan/react-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
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
