import { ImageExtension } from '../../interface';

export default new ImageExtension<string>(
  {
    name: '二维码',
    icon: 'qrcode',
    version: '0.0.1',
    description: '把当前页面的 URL 转换成二维码',
  },
  {
    init: ({ accountInfo: { type } }) => {
      if (type !== 'yuque') {
        return false;
      }
      return true;
    },
    run: async context => {
      const { QRCode, document } = context;
      const dataUrl = await QRCode.toDataURL(document.URL);
      return dataUrl;
    },
    afterRun: async context => {
      const { result: dataUrl } = context;
      return { dataUrl, width: 200, height: 200 };
    },
  }
);
