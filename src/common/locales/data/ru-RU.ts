import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/ru_RU';
import messages from './ru-RU.json';

const model: LocaleModel = {
  antd,
  name: 'русский',
  locale: 'ru-RU',
  messages,
  alias: [],
};

export default model;
