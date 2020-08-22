import { TextExtension } from '@/extensions/common';

export default new TextExtension<string>(
  {
    name: 'QR code',
    icon: 'qrcode',
    version: '0.0.1',
    description: 'Convert the URL of the current page to a QR code.',
    i18nManifest: {
      'zh-CN': { name: '二维码', description: '显示当前链接为二维码' },
    },
  },
  {
    init: ({ currentImageHostingService }) => !!currentImageHostingService,
    run: async context => {
      const { QRCode, document } = context;
      const dataUrl = await QRCode.toDataURL(document.URL);
      return dataUrl;
    },
    afterRun: async context => {
      const { result: dataUrl } = context;
      return `![](${dataUrl})\n`;
    },
  }
);
