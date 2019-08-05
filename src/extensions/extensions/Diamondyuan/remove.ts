import { ToolExtension } from '@web-clipper/extensions';

export default new ToolExtension(
  {
    name: '删除元素',
    icon: 'delete',
    version: '0.0.1',
    description: '删除页面元素',
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
