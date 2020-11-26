import { TextExtension } from '@/extensions/common';
import { SelectAreaPosition } from '@web-clipper/area-selector';

export default new TextExtension<SelectAreaPosition>(
  {
    name: 'OCR',
    icon: 'ocr',
    version: '0.0.3',
    apiVersion: '1.13.0',
    powerpack: true,
    i18nManifest: {
      'zh-CN': { name: '文字识别' },
    },
  },
  {
    run: async context => {
      const { AreaSelector, toggleClipper, toggleLoading } = context;
      toggleClipper();
      const response = await new AreaSelector().start();
      toggleLoading();
      return response;
    },
    afterRun: async context => {
      const { result, loadImage, captureVisibleTab, ocr } = context;
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
      const image = canvas.toDataURL('image/jpeg');
      const res = await ocr({ image, language_type: 'CHN_ENG' });
      return res;
    },
    destroy: async context => {
      const { toggleClipper, toggleLoading } = context;
      toggleLoading();
      toggleClipper();
    },
  }
);
