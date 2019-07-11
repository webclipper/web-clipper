import { ToolExtension } from '../../interface';

export default new ToolExtension(
  {
    name: '手动选取',
    icon: 'select',
    version: '0.0.1',
  },
  {
    init: ({ pathname }) => {
      if (pathname === '/') {
        return false;
      }
      return true;
    },
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
    afterRun: context => {
      const { result, data } = context;
      return `${data}\n${result}`;
    },
  }
);
