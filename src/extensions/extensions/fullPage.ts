import { TextExtension } from '@/extensions/common';

export default new TextExtension(
  {
    name: 'Full Page',
    version: '0.0.1',
    description: 'Save Full Page and turn ro Markdown.',
    icon: 'copy',
		i18nManifest: {
			'de-DE': { name: 'Vollständige Seite', description: 'Speichern Sie die gesamte Seite und konvertieren Sie sie in Markdown.' },
			'en-US': { name: 'Full Page', description: 'Save Full Page and turn to Markdown.' },
			'ja-JP': { name: '全ページ', description: '全ページを保存し、Markdownに変換します。' },
			'ko-KR': { name: '전체 페이지', description: '전체 페이지를 저장하고 Markdown으로 변환합니다.' },
			'ru-RU': { name: 'Полная страница', description: 'Сохранить полную страницу и преобразовать в Markdown.' },
			'zh-CN': { name: '整个页面', description: '把整个页面元素转换为 Markdown' },
		}
	},
  {
    run: async context => {
      const { turndown, $ } = context;
      const $body = $('html').clone();
      $body.find('script').remove();
      $body.find('style').remove();
      $body.removeClass();
      return turndown.turndown($body.html());
    },
  }
);
