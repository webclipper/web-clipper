import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/ja_JP';
import messages from './ja-JP.json';

const model: LocaleModel = {
  antd,
  name: '日本語',
  locale: 'ja-JP',
  messages,
  alias: ['jp'],
};

export default model;
