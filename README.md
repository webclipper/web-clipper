<h1 align="center">语雀剪藏</h1>
<p align="center">
    <a href="https://travis-ci.org/yuquewebclipper/yuque-web-clipper">
      <img src="https://img.shields.io/travis/yuquewebclipper/yuque-web-clipper/master.svg?style=flat-square" alt="Build Status">
    </a>
    <a href="https://codecov.io/gh/yuquewebclipper/yuque-web-clipper">
      <img src="https://img.shields.io/codecov/c/github/yuquewebclipper/yuque-web-clipper/master.svg?style=flat-square" alt="Codecov">
    </a>
</p>

### 安装

[Chrome 商店](https://chrome.google.com/webstore/detail/语雀剪藏/pdecnpgmmhjfnoiebndphjggimhjhdog)

[离线安装](https://www.yuque.com/yuqueclipper/av5y68/ayau8f)

### 如何开发

#### 开发

```
$ git clone https://github.com/yuquewebclipper/yuque-web-clipper.git
$ cd yuque-web-clipper
$ yarn
$ yarn dev
```

在 chrome 导入 dist 文件夹。为了区分测试和正式，测试的插件是红色背景的。

#### 测试

```
$ yarn test /src
```

⚠️ 目前测试文件中写了一个 token。在运行测试的时候，请**不要**用自己的 token 替换，否则会造成你**删除全部的个人以及团队知识库**

### 剪藏所使用的开源框架与工具

- [React](https://github.com/facebook/react/)
- [Mobx](https://github.com/mobxjs/mobx)
- [Ant Design](https://github.com/ant-design/ant-design/) (蚂蚁金服出品的一套企业级的 UI 设计语言和 React 实现。语雀同款。)
- [turndown](https://github.com/domchristie/turndown)(将 HTML 转换为 Markdown。)
- [HyperMD](https://github.com/laobubu/HyperMD)(所见即所得的开源 Markdown 编辑器。)
- [Readability](https://github.com/mozilla/readability) (Mozilla 基于 Arc90's readability.js (1.7.1) script 编写的网页正文提取插件。）
- [SimpRead](https://github.com/Kenshin/simpread) (手动提取，删除元素等功能参考了 简悦(SimpRead) 的部分源码。)
- [dayjs](https://github.com/iamkun/dayjs) (用于替代 Moment.js,体积小。)
