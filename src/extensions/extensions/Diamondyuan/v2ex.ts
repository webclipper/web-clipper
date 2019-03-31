import { TextExtension } from '../../interface';

export default new TextExtension(
  {
    name: 'V2',
    version: '0.0.1',
    description: '保存V2标题',
    icon: 'link',
  },
  {
    init: ({ url }) => {
      return !!url && url.includes('v2ex');
    },
    run: async context => {
      const { document } = context;
      return Array.from(
        document.querySelectorAll(
          '#Main > div:nth-child(2) > div > table > tbody > tr > td:nth-child(3) > span.item_title > a'
        )
      )
        .map((a: any) => a.innerText)
        .join('\n');
    },
  }
);
