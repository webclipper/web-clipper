import { TextExtension } from '@/extensions/common';

export default new TextExtension(
  {
    name: 'Readability',
    icon: 'copy',
    version: '0.0.1',
    description: 'Intelligent extraction of webpage main content.',
		i18nManifest: {
			'de-DE': { name: 'Lesbarkeit', description: 'Intelligente Extraktion des Hauptinhalts der Webseite.' },
			'en-US': { name: 'Readability', description: 'Intelligent extraction of webpage main content.' },
			'ja-JP': { name: '読みやすさ', description: 'ウェブページの主要な内容をインテリジェントに抽出します。' },
			'ko-KR': { name: '가독성', description: '웹 페이지의 주요 내용을 지능적으로 추출합니다.' },
			'ru-RU': { name: 'Читаемость', description: 'Интеллектуальная извлечение основного содержимого веб-страницы.' },
			'zh-CN': { name: '智能提取', description: '智能提取当前页面元素' },
		}
	},
  {
    run: async context => {
      const { turndown, document, Readability, $ } = context;
      let documentClone = document.cloneNode(true);
      $(documentClone)
        .find('#skPlayer')
        .remove();
      let article = new Readability(documentClone, {
        keepClasses: true,
      }).parse();
      return turndown.turndown(article.content);
    },
  }
);
