import { TextExtension } from '@web-clipper/extensions';

export default new TextExtension(
  {
    name: '书签',
    version: '0.0.1',
    description: '保存网页链接和增加备注',
    icon: 'link',
  },
  {
    run: async context => {
      const { document } = context;
      return `## 链接 \n ${document.URL} \n ## 备注:`;
    },
  }
);
