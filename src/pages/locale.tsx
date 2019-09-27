import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
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
      <ConfigProvider
        locale={antd}
        getPopupContainer={e => {
          if (!e || !e.parentNode) {
            return document.body;
          }
          return e.parentNode as HTMLElement;
        }}
      >
        {children}
      </ConfigProvider>
    </IntlProvider>
  );
};

export default connect(mapStateToProps)(LocalWrapper);
