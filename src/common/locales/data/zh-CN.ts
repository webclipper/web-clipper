import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/zh_CN';
import messages from './zh-CN.json';

const model: LocaleModel = {
  antd,
  name: '简体中文',
  locale: 'zh-CN',
  messages,
  alias: ['zh'],
};

export default model;
