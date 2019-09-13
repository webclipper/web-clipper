import React from 'react';
import { IntlProvider } from 'react-intl';
import { LocaleProvider } from 'antd';
import { connect } from 'dva';
import { localesMap } from '@/common/locales';
import { GlobalStore } from '@/common/types';

const mapStateToProps = ({ userPreference: { locale } }: GlobalStore) => {
  return {
    locale,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;

const LocalWrapper: React.FC<PageStateProps> = ({ children, locale }) => {
  const language = locale;
  const { antd, messages } = (localesMap.get(language) || localesMap.get('en-US'))!;
  return (
    <IntlProvider key={locale} locale={language} messages={messages}>
      <LocaleProvider locale={antd}>{children}</LocaleProvider>
    </IntlProvider>
  );
};

export default connect(mapStateToProps)(LocalWrapper);
