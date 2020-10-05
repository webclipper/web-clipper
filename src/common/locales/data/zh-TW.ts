import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/zh_TW';
import messages from './zh-TW.json';

const model: LocaleModel = {
  antd,
  name: '繁體中文',
  locale: 'zh-TW',
  messages,
  alias: ['tw'],
};

export default model;
