import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/ru_RU';

const messages = {
  'tool.save': 'Сохранить контент',
  'preference.basic.configLanguage.description':
    'Мой родной язык китайский, добро пожаловать на перевод на {GitHub}.',
};

const model: LocaleModel = {
  antd,
  name: 'русский',
  locale: 'ru-RU',
  messages,
  alias: [],
};

export default model;
