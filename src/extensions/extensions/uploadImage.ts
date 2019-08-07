import { ToolExtension } from '@web-clipper/extensions';

export default new ToolExtension(
  {
    name: '上传图片',
    icon: 'sync',
    version: '0.0.1',
    description: '同步图片到图床',
  },
  {
    init: ({ pathname, currentImageHostingService }) =>
      pathname.startsWith('/plugins') && !!currentImageHostingService,
    afterRun: async context => {
      const { data, imageService, message } = context;
      let foo = data;
      const result = data.match(/!\[.*?\]\(http(.*?)\)/g);
      if (result) {
        const images: string[] = result
          .map(o => {
            const temp = /!\[.*?\]\((http.*?)\)/.exec(o);
            if (temp) {
              return temp[1];
            }
            return '';
          })
          .filter(o => o && !o.startsWith('https://cdn-pri.nlark.com'));
        for (let image of images) {
          try {
            const url = await imageService.uploadImageUrl(image);
            foo = foo.replace(image, url);
          } catch (_error) {
            message.info('上传图片失败');
          }
        }
      }
      message.info('上传图片成功');
      return foo;
    },
  }
);
