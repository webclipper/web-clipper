import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Copy To Clipboard',
    icon: 'copy',
    version: '0.0.1',
    description: 'Copy To Clipboard',
		i18nManifest: {
			'de-DE': { name: 'In die Zwischenablage kopieren', description: 'In die Zwischenablage kopieren.' },
			'en-US': { name: 'Copy To Clipboard', description: 'Copy To Clipboard' },
			'ja-JP': { name: 'クリップボードにコピー', description: 'クリップボードにコピーします。' },
			'ko-KR': { name: '클립보드에 복사', description: '클립보드에 복사합니다.' },
			'ru-RU': { name: 'Копировать в буфер обмена', description: 'Копировать в буфер обмена' },
			'zh-CN': { name: '复制', description: '复制到剪贴板' },
		}
	},
  {
    afterRun: ({ copyToClipboard, data }) => {
      copyToClipboard(data);
      return data;
    },
  }
);
