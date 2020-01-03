import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/ko_KR';
import messages from './ko-KR.json';

const model: LocaleModel = {
  antd,
  name: '한국어',
  locale: 'ko-KR',
  messages,
  alias: [],
};

export default model;
