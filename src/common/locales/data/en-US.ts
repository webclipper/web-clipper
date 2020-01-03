import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/en_US';
import messages from './en-US.json';

const model: LocaleModel = {
  antd,
  name: 'English',
  locale: 'en-US',
  messages,
  alias: ['en'],
};

export default model;
