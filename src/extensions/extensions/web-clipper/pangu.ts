import { ToolExtension } from '@/extensions/common';
import { SelectAreaPosition } from '@web-clipper/area-selector';

export default new ToolExtension<SelectAreaPosition>(
  {
    name: 'Pangu',
    icon: 'pangu',
    version: '0.0.2',
    automatic: true,
    apiVersion: '1.13.0',
    description: 'Paranoid text spacing in JavaScript',
    powerpack: false,
    i18nManifest: {
      'zh-CN': {
        name: '盘古',
        description: '所有的中文字和半形的英文、数字、符号之间插入空白。',
      },
    },
  },
  {
    afterRun: async context => {
      const { pangu, data } = context;
      return pangu(data);
    },
  }
);
