import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Upload Image',
    icon: 'sync',
    version: '0.0.1',
    description: 'Upload images to image host.',
    i18nManifest: {
      'zh-CN': { name: '上传图片', description: '把文章内图片上传到图床' },
    },
  },
  {
    init: ({ pathname, currentImageHostingService }) =>
      pathname.startsWith('/plugins') && !!currentImageHostingService,
    afterRun: async context => {
      const { data, imageService, message } = context;
      let foo = data;
      const result = data.match(/!\[.*?\]\(http(.*?)\)/g);
      let successCount = 0;
      let failedCount = 0;
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
            const url = await imageService!.uploadImageUrl(image);
            foo = foo.replace(image, url);
            successCount++;
          } catch (_error) {
            failedCount++;
          }
        }
      }
      message.info(`${successCount} success,${failedCount} failed.`);
      return foo;
    },
  }
);
