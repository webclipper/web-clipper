import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Delete Element',
    icon: 'delete',
    version: '0.0.1',
    description: 'Delete selected page elements.',
    i18nManifest: {
      'zh-CN': { name: '删除元素', description: '删除选择的页面元素。' },
    },
  },
  {
    run: async context => {
      const { $, Highlighter, toggleClipper } = context;
      toggleClipper();
      const data = await new Highlighter().start();
      $(data).remove();
      toggleClipper();
    },
  }
);
