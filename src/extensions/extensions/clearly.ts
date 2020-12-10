import { TextExtension } from '@/extensions/common';

export default new TextExtension<{ title: string; html: string; url: string }>(
  {
    name: 'Clearly',
    icon: 'copy',
    version: '0.0.1',
    description: 'Super',
  },
  {
    init: () => false,
    run: async context => {
      const { document } = context;
      let html = document.body.outerHTML;
      return {
        html,
        title: document.title,
        url: document.URL,
      };
    },
    afterRun: async context => {
      const { result, clearly } = context;
      return clearly(result);
    },
  }
);
