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
      'de-DE': { name: 'Pangu', description: 'Fügen Sie Leerzeichen zwischen chinesischen und englischen Zeichen ein.' },
      'en-US': { name: 'Pangu', description: 'Paranoid text spacing in JavaScript' },
      'ja-JP': { name: 'Pangu', description: 'すべての中国語と半角英数字、記号の間に空白を挿入します。' },
      'ko-KR': { name: 'Pangu', description: '모든 한자와 반각 영어, 숫자, 기호 사이에 공백을 삽입합니다.' },
      'ru-RU': { name: 'Pangu', description: 'Вставка пробелов между китайскими и английскими символами.' },
      'zh-CN': { name: 'Pangu', description: '所有的中文字和半形的英文、数字、符号之间插入空白。' },
    },
  },
  {
    afterRun: async context => {
      const { pangu, data } = context;
      return pangu(data);
    },
  }
);
