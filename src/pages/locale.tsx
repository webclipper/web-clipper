import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import { connect } from 'dva';
import { localesMap } from '@/common/locales';
import { localeProvider } from '@/common/locales/antd';
import { GlobalStore } from '@/common/types';

const mapStateToProps = ({ userPreference: { locale } }: GlobalStore) => {
  return {
    locale,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;

const LocalWrapper: React.FC<PageStateProps> = ({ children, locale }) => {
  const language = locale;
  const model = (localesMap.get(language) || localesMap.get('en-US'))!;
  return (
    <IntlProvider key={locale} locale={language} messages={model.messages}>
      <ConfigProvider
        locale={localeProvider[model.locale as keyof typeof localeProvider]}
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
