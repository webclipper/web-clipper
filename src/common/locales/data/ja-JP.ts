import { LocaleModel } from '@/common/locales/interface';
import antd from 'antd/lib/locale-provider/ja_JP';

const messages = {
  'tool.title': '記事タイトル',
  'tool.save': 'コンテンツを保存する',
  'preference.basic.configLanguage.description':
    '私の母国語は中国語です,{GitHub}で翻訳を送信してください.',
};

const model: LocaleModel = {
  antd,
  name: '日本語',
  locale: 'ja-JP',
  messages,
  alias: ['jp'],
};

export default model;
