import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/modelTypes/userPreference';
import { createIntlCache, createIntl, IntlShape, MessageDescriptor } from 'react-intl';
import { LocaleModel, removeEmptyKeys } from './interface';
import { localStorageService } from '@/common/chrome/storage';

const context = require.context('./data', true, /\.[t|j]s$/);

export const locales = context.keys().map(key => {
  const model = context(key).default as LocaleModel;
  const en = context('./en-US.ts').default as LocaleModel;
  return {
    ...model,
    messages: removeEmptyKeys(model.messages, en.messages),
  };
});

export const localesMap = locales.reduce((p, l) => {
  p.set(l.locale, l);
  return p;
}, new Map<string, LocaleModel>());

export const getLanguage = () => {
  const language = navigator.language;
  for (const { locale, alias } of locales) {
    if (locale === language || alias.some(o => o === language)) {
      return locale;
    }
  }
  return language;
};

class LocaleService {
  private intl?: IntlShape;
  async init() {
    const locale = localStorageService.get(LOCAL_USER_PREFERENCE_LOCALE_KEY, getLanguage());
    const messages = (localesMap.get(locale) || localesMap.get('en-US'))!.messages;
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

  format(descriptor: MessageDescriptor, values?: Record<string, any>): string {
    if (!this.intl) {
      throw Error('Should init intl before use');
    }
    return this.intl.formatMessage(descriptor, values);
  }
}

export default new LocaleService();
