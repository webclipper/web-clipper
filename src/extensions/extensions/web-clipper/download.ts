import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Save as Markdown',
    icon: 'file-markdown',
    version: '0.0.2',
    description: 'Save as Markdown and Download.',
    apiVersion: '1.12.0',
    i18nManifest: {
      'de-DE': { name: 'Als Markdown speichern', description: 'Als Markdown speichern und herunterladen.' },
      'en-US': { name: 'Save as Markdown', description: 'Save as Markdown and Download.' },
      'ja-JP': { name: 'Markdownとして保存', description: 'Markdownとして保存し、ダウンロードします。' },
      'ko-KR': { name: 'Markdown으로 저장', description: 'Markdown으로 저장하고 다운로드합니다.' },
      'ru-RU': { name: 'Сохранить как Markdown', description: 'Сохранить как Markdown и скачать.' },
      'zh-CN': { name: '保存为 Markdown', description: '保存为 Markdown 并下载' },
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
