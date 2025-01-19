import { ToolExtension } from '@/extensions/common';

export default new ToolExtension(
  {
    name: 'Upload Image',
    icon: 'sync',
    version: '0.0.1',
    automatic: true,
    description: 'Upload images to image host.',
    i18nManifest: {
      'de-DE': { name: 'Bild hochladen', description: 'Bilder auf den Bildhost hochladen.' },
      'en-US': { name: 'Upload Image', description: 'Upload images to image host.' },
      'ja-JP': { name: '画像をアップロード', description: '画像を画像ホストにアップロードします。' },
      'ko-KR': { name: '이미지 업로드', description: '이미지를 이미지 호스트에 업로드합니다.' },
      'ru-RU': { name: 'Загрузить изображение', description: 'Загрузить изображения на хост изображений.' },
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
