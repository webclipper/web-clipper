import { TextExtension } from '../../interface';

export default new TextExtension(
  {
    name: '手动选取',
    icon: 'select',
    version: '0.0.1',
  },
  {
    run: async context => {
      const { turndown, Highlighter, toggleClipper } = context;
      toggleClipper();
      const data = await new Highlighter().start();
      toggleClipper();
      return turndown.turndown(data);
    },
  }
);
