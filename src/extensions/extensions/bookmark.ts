import { TextExtension } from '@web-clipper/extensions';

export default new TextExtension(
  {
    name: 'Bookmark',
    version: '0.0.1',
    description: 'Add bookmark.',
    icon: 'link',
  },
  {
    run: async context => {
      const { document } = context;
      return `## Link \n ${document.URL} \n ## Comment:`;
    },
  }
);
