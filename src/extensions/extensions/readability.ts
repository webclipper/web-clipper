import { TextExtension } from '@web-clipper/extensions';

export default new TextExtension(
  {
    name: '智能提取',
    icon: 'copy',
    version: '0.0.1',
    description: '智能分析出页面的主要部分',
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
