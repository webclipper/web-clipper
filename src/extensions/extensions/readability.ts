import { TextExtension } from '@web-clipper/extensions';

export default new TextExtension(
  {
    name: 'Readability',
    icon: 'copy',
    version: '0.0.1',
    description: 'Intelligent extraction of webpage main content.',
    i18nManifest: {
      'zh-CN': { name: '智能提取', description: '智能提取当前页面元素' },
    },
  },
  {
    run: async context => {
      const { turndown, document, Readability } = context;
      let documentClone = document.cloneNode(true);
      let article = new Readability(documentClone).parse();
      return turndown.turndown(article.content);
    },
  }
);
