import { TextExtension } from '@web-clipper/extensions';

export default new TextExtension(
  {
    name: '手动选取',
    icon: 'select',
    version: '0.0.1',
    description: '手动选取页面元素',
  },
  {
    run: async context => {
      const { turndown, Highlighter, toggleClipper } = context;
      toggleClipper();
      try {
        const data = await new Highlighter().start();
        return turndown.turndown(data);
      } catch (error) {
        throw error;
      } finally {
        toggleClipper();
      }
    },
  }
);
