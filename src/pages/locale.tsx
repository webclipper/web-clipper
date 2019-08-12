import React from 'react';
import { IntlProvider } from 'react-intl';
import enUS from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';

import { LocaleProvider } from 'antd';
import zh from 'antd/lib/locale-provider/zh_CN';
import en from 'antd/lib/locale-provider/en_US';

const localData: {
  [local: string]: {
    intl: any;
    antdIntl: any;
  };
} = {
  'zh-CN': {
    intl: zhCN,
    antdIntl: zh,
  },
  'en-US': {
    intl: enUS,
    antdIntl: en,
  },
};

const LocalWrapper: React.FC = ({ children }) => {
  const language = 'en-US';
  const { intl, antdIntl } = localData[language] || localData['en-US'];
  return (
    <IntlProvider locale={language} messages={intl}>
      <LocaleProvider locale={antdIntl}>{children}</LocaleProvider>
    </IntlProvider>
  );
};

export default LocalWrapper;
