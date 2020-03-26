import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Clear',
    icon: 'close-circle',
    version: '0.0.1',
    description: 'Clear Content',
    apiVersion: '1.12.0',
    i18nManifest: {
      'zh-CN': {
        name: '清空',
        description: '清空内容',
      },
    },
  },
  {
    init: ({ pathname }) => {
      return pathname.startsWith('/plugin');
    },
    afterRun: () => {
      return '';
    },
  }
);
