import { TextExtension } from '@/extensions/common';

export default new TextExtension(
  {
    name: 'Bookmark',
    version: '0.0.1',
    description: 'Add bookmark.',
    icon: 'link',
    i18nManifest: {
			'de-DE': { name: 'Lesezeichen', description: 'Lesezeichen hinzufügen.' },
			'en-US': { name: 'Bookmark', description: 'Add bookmark.' },
			'ja-JP': { name: 'ブックマーク', description: 'ブックマークを追加します。' },
			'ko-KR': { name: '북마크', description: '북마크 추가.' },
			'ru-RU': { name: 'Закладка', description: 'Добавить закладку.' },
			'zh-CN': { name: '书签', description: '添加书签' },
    },
  },
  {
    run: async (context) => {
      const { document, locale } = context;
      switch (locale) {
        case 'zh-CN': {
          return `## 链接 \n [${document.URL}](${document.URL}) \n ## 备注:`;
        }
        default:
          return `## Link \n [${document.URL}](${document.URL}) \n ## Comment:`;
      }
    },
  }
);
