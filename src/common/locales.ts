import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from './modelTypes/userPreference';
import { createIntlCache, createIntl, IntlShape, MessageDescriptor } from 'react-intl';
import enUS from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';
import jaJP from '@/locales/ja-JP';

import { localStorageService } from './chrome/storage';

export const getLanguage = () => {
  const languageMap: {
    [key: string]: string;
  } = {
    zh: 'zh-CN',
    jp: 'jp-JP',
  };
  return languageMap[navigator.language] || navigator.language;
};

const localData: {
  [local: string]: {
    intl: any;
  };
} = {
  'zh-CN': {
    intl: zhCN,
  },
  'en-US': {
    intl: enUS,
  },
  'ja-JP': {
    intl: jaJP,
  },
};

class LocaleService {
  private intl?: IntlShape;
  async init() {
    const locale = localStorageService.get(LOCAL_USER_PREFERENCE_LOCALE_KEY, getLanguage());
    const messages = (localData[locale] || localData['en-US']).intl;
    const cache = createIntlCache();
    const intl = createIntl(
      {
        locale,
        messages: messages,
      },
      cache
    );
    this.intl = intl;
  }

  format(descriptor: MessageDescriptor): string {
    if (!this.intl) {
      throw Error('Should init intl before use');
    }
    return this.intl.formatMessage(descriptor);
  }
}

export default new LocaleService();
