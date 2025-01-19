import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Delete Element',
    icon: 'delete',
    version: '0.0.1',
    description: 'Delete selected page elements.',
    i18nManifest: {
      'de-DE': { name: 'Element löschen', description: 'Ausgewählte Seitenelemente löschen.' },
      'en-US': { name: 'Delete Element', description: 'Delete selected page elements.' },
      'ja-JP': { name: '要素を削除', description: '選択したページ要素を削除します。' },
      'ko-KR': { name: '요소 삭제', description: '선택한 페이지 요소를 삭제합니다.' },
      'ru-RU': { name: 'Удалить элемент', description: 'Удалить выбранные элементы страницы.' },
      'zh-CN': { name: '删除元素', description: '删除选择的页面元素。' },
      'zh-TW': { name: '刪除元素', description: '刪除選擇的頁面元素。' },
    },
  },
  {
    run: async context => {
      const { $, Highlighter, toggleClipper } = context;
      toggleClipper();
      const data = await new Highlighter().start();
      $(data).remove();
      toggleClipper();
    },
  }
);
