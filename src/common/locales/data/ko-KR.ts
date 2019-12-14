import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/ko_KR';

const messages = {
  'tool.save': '컨텐츠 저장',
  'preference.basic.configLanguage.description':
    '내 모국어는 중국어입니다, {GitHub} 에 번역을 제출해 주셔서 감사합니다.',
};

const model: LocaleModel = {
  antd,
  name: '한국어',
  locale: 'ko-KR',
  messages,
  alias: [],
};

export default model;
