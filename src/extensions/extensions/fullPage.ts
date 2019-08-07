import { TextExtension } from '@web-clipper/extensions';

export default new TextExtension(
  {
    name: '整个页面',
    version: '0.0.1',
    description: '保存整个页面',
    icon: 'copy',
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
