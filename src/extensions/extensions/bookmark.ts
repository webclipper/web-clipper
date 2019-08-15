import { TextExtension } from '@web-clipper/extensions';

export default new TextExtension(
  {
    name: 'Bookmark',
    version: '0.0.1',
    description: 'Add bookmark.',
    icon: 'link',
    i18nManifest: {
      'zh-CN': { name: '书签', description: '添加书签' },
    },
  },
  {
    run: async context => {
      const { document } = context;
      return `## Link \n ${document.URL} \n ## Comment:`;
    },
  }
);
