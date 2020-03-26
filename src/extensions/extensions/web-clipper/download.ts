import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Save as Markdown',
    icon: 'file-markdown',
    version: '0.0.2',
    description: 'Save as Markdown and Download.',
    apiVersion: '1.12.0',
    i18nManifest: {
      'zh-CN': {
        name: '保存为 Markdown',
        description: '保存为 Markdown 并下载',
      },
    },
  },
  {
    init: ({ pathname }) => {
      return pathname.startsWith('/plugin');
    },
    run: ({ document }) => {
      return document.title;
    },
    afterRun: ({ createAndDownloadFile, data, result }) => {
      createAndDownloadFile(`${result || 'content'}.md`, data);
      return data;
    },
  }
);
