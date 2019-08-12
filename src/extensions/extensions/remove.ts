import { ToolExtension } from '@web-clipper/extensions';

export default new ToolExtension(
  {
    name: 'Delete Element',
    icon: 'delete',
    version: '0.0.1',
    description: 'Delete selected page elements.',
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
