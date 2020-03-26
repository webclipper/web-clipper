import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Copy To Clipboard',
    icon: 'copy',
    version: '0.0.1',
    description: 'Copy To Clipboard',
    i18nManifest: {
      'zh-CN': {
        name: '复制到剪切板',
        description: 'Copy To Clipboard',
      },
    },
  },
  {
    afterRun: ({ copyToClipboard, data }) => {
      copyToClipboard(data);
      return data;
    },
  }
);
