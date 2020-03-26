import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Manual selection',
    icon: 'select',
    version: '0.0.1',
    description: 'Manual selection page element.',
    i18nManifest: {
      'zh-CN': { name: '手动选取' },
    },
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
