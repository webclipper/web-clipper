import React from 'react';
import { IntlProvider } from 'react-intl';
import enUS from '@/locales/en-US';
import zhCN from '@/locales/zh-CN';

import { LocaleProvider } from 'antd';
import zh from 'antd/lib/locale-provider/zh_CN';
import en from 'antd/lib/locale-provider/en_US';
import { connect } from 'dva';
import { GlobalStore } from '@/common/types';

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

const mapStateToProps = ({ userPreference: { locale } }: GlobalStore) => {
  return {
    locale,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;

const LocalWrapper: React.FC<PageStateProps> = ({ children, locale }) => {
  const language = locale;
  const { intl, antdIntl } = localData[language] || localData['en-US'];
  return (
    <IntlProvider key={locale} locale={language} messages={intl}>
      <LocaleProvider locale={antdIntl}>{children}</LocaleProvider>
    </IntlProvider>
  );
};

export default connect(mapStateToProps)(LocalWrapper);
