import { TextExtension } from '@/extensions/common';

export default new TextExtension<string>(
  {
    name: 'QR code',
    icon: 'qrcode',
    version: '0.0.1',
    description: 'Convert the URL of the current page to a QR code.',
		i18nManifest: {
			'de-DE': { name: 'QR-Code', description: 'Konvertieren Sie die URL der aktuellen Seite in einen QR-Code.' },
			'en-US': { name: 'QR code', description: 'Convert the URL of the current page to a QR code.' },
			'ja-JP': { name: 'QRコード', description: '現在のページのURLをQRコードに変換します。' },
			'ko-KR': { name: 'QR 코드', description: '현재 페이지의 URL을 QR 코드로 변환합니다.' },
			'ru-RU': { name: 'QR код', description: 'Преобразовать URL текущей страницы в QR-код.' },
			'zh-CN': { name: '二维码', description: '显示当前链接为二维码' },
		}
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
