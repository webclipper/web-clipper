import { TextExtension } from '@/extensions/common';

export default new TextExtension(
  {
    name: 'Full Page',
    version: '0.0.1',
    description: 'Save Full Page and turn ro Markdown.',
    icon: 'copy',
    i18nManifest: {
      'zh-CN': { name: '整个页面', description: '把整个页面元素转换为 Markdown' },
    },
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
