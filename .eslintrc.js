module.exports = {
  extends: [
    'eslint-config-alloy/typescript-react',
  ],
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    //
    // React: false,
    // ReactDOM: false
  },
  rules: {
    parserOptions: {
      ecmaFeatures: {
        ts: false
      }
    },
    // 空行不超过一个
    "no-multiple-empty-lines": [2, { "max": 1 }],
    // @fixable 一个缩进必须用两个空格替代
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
    // @fixable jsx 的 children 缩进必须为两个空格
    'react/jsx-indent': [
      'error',
      2
    ],
    // @fixable jsx 的 props 缩进必须为两个空格
    'react/jsx-indent-props': [
      'error',
      2
    ]
  }
};
