import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Manual selection',
    icon: 'select',
    version: '0.0.1',
    description: 'Manual selection page element.',
    i18nManifest: {
      'de-DE': { name: 'Manuelle Auswahl', description: 'Manuelle Auswahl von Seitenelementen.' },
      'en-US': { name: 'Manual selection', description: 'Manual selection of page elements.' },
      'ja-JP': { name: '手動選択', description: 'ページ要素を手動で選択します。' },
      'ko-KR': { name: '수동 선택', description: '페이지 요소를 수동으로 선택합니다.' },
      'ru-RU': { name: 'Ручной выбор', description: 'Ручной выбор элементов страницы.' },
      'zh-CN': { name: '手动选取', description: '手动选取页面中的元素' },
    },
  },
  {
    init: ({ pathname }) => {
      if (pathname === '/') {
        return false;
      }
      return true;
    },
    run: async context => {
      const { turndown, Highlighter, toggleClipper } = context;
      toggleClipper();
      try {
        const data = await new Highlighter().start();
        return turndown.turndown(data);
      } catch (error) {
        throw error;
      } finally {
        toggleClipper();
      }
    },
    afterRun: context => {
      const { result, data } = context;
      return `${data}\n${result}`;
    },
  }
);
