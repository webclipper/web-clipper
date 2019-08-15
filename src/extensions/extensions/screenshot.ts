import { ImageExtension } from '@web-clipper/extensions';
import { SelectAreaPosition } from '@web-clipper/area-selector';

export default new ImageExtension<SelectAreaPosition>(
  {
    name: 'Screenshots',
    icon: 'picture',
    version: '0.0.1',
    i18nManifest: {
      'zh-CN': { name: '截图' },
    },
  },
  {
    init: ({ currentImageHostingService }) => !!currentImageHostingService,
    run: async context => {
      const { AreaSelector, toggleClipper } = context;
      toggleClipper();
      const response = new AreaSelector().start();
      return response;
    },
    afterRun: async context => {
      const { result, loadImage, captureVisibleTab } = context;
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
      return { dataUrl: canvas.toDataURL(), width: swidth, height: sheight };
    },
    destroy: async context => {
      const { toggleClipper } = context;
      toggleClipper();
    },
  }
);
