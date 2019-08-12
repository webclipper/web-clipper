import { TextExtension } from '@web-clipper/extensions';

export default new TextExtension(
  {
    name: 'Manual selection',
    icon: 'select',
    version: '0.0.1',
    description: 'Manual selection page element.',
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
