import { TextExtension } from '@web-clipper/extensions';

export default new TextExtension(
  {
    name: 'Full Page',
    version: '0.0.1',
    description: 'Save Full Page and turn ro Markdown.',
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
