import { ImageExtension } from '@web-clipper/extensions';

export default new ImageExtension<string>(
  {
    name: 'QR code',
    icon: 'qrcode',
    version: '0.0.1',
    description: 'Convert the URL of the current page to a QR code.',
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
      return { dataUrl, width: 200, height: 200 };
    },
  }
);
