import { TextExtension } from '@/extensions/common';
import { SelectAreaPosition } from '@web-clipper/area-selector';

export default new TextExtension<SelectAreaPosition>(
  {
    name: 'Screenshots',
    icon: 'picture',
    version: '0.0.1',
		i18nManifest: {
			'de-DE': { name: 'Screenshots', description: 'Speichern Sie den aktuellen Inhalt als Bild.' },
			'en-US': { name: 'Screenshots', description: 'Save current clipping content as an image.' },
			'ja-JP': { name: 'スクリーンショット', description: '現在のクリップ内容を画像として保存します。' },
			'ko-KR': { name: '스크린샷', description: '현재 클립 내용을 이미지로 저장합니다.' },
			'ru-RU': { name: 'Скриншоты', description: 'Сохранить текущее содержимое как изображение.' },
			'zh-CN': { name: '截图', description: '将当前剪藏内容保存为图片' }, // 保留简体中文
		}
	},
  {
    init: ({ currentImageHostingService }) => !!currentImageHostingService,
    run: async context => {
      const { AreaSelector, toggleClipper, toggleLoading } = context;
      toggleClipper();
      const response = await new AreaSelector().start();
      toggleLoading();
      return response;
    },
    afterRun: async context => {
      const { result, loadImage, captureVisibleTab, imageService } = context;
      const base64Capture = await captureVisibleTab();
      const img = await loadImage(base64Capture);
      let canvas: HTMLCanvasElement = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let sx;
      let sy;
      let sheight;
      let swidth;
      let {
        rightBottom: { clientX: rightBottomX, clientY: rightBottomY },
        leftTop: { clientX: leftTopX, clientY: leftTopY },
      } = result;
      if (rightBottomX === leftTopX && rightBottomY === leftTopY) {
        sx = 0;
        sy = 0;
        swidth = img.width;
        sheight = img.height;
      } else {
        const dpi = window.devicePixelRatio;
        sx = leftTopX * dpi;
        sy = leftTopY * dpi;
        swidth = (rightBottomX - leftTopX) * dpi;
        sheight = (rightBottomY - leftTopY) * dpi;
      }
      canvas.height = sheight;
      canvas.width = swidth;
      ctx!.drawImage(img, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
      const url = await imageService!.uploadImage({
        data: canvas.toDataURL(),
      });
      return `![](${url})\n\n`;
    },
    destroy: async context => {
      const { toggleClipper, toggleLoading } = context;
      toggleLoading();
      toggleClipper();
    },
  }
);
