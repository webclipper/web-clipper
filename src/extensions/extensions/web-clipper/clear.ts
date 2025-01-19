import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Clear',
    icon: 'close-circle',
    version: '0.0.1',
    description: 'Clear Content',
    apiVersion: '1.12.0',
		i18nManifest: {
			'de-DE': { name: 'Löschen', description: 'Inhalt löschen.' },
			'en-US': { name: 'Clear', description: 'Clear Content' },
			'ja-JP': { name: 'クリア', description: '内容をクリアします。' },
			'ko-KR': { name: '지우기', description: '내용 지우기' },
			'ru-RU': { name: 'Очистить', description: 'Очистить содержимое' },
			'zh-CN': { name: '清空', description: '清空内容' },
		}
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
