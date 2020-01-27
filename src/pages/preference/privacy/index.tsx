import React from 'react';
import { GlobalStore } from '@/common/types';
import { useSelector } from 'dva';
import { Skeleton } from 'antd';
import ReactMarkdown from 'react-markdown';
import LinkRender from '@/components/LinkRender';
import config from '@/config';
import request from 'umi-request';
import Container from 'typedi';
import { IConfigService } from '@/service/common/config';
import { useObserver } from 'mobx-react';
import { useFetch } from '@shihengtech/hooks';

const Changelog: React.FC = () => {
  const { locale } = useSelector(({ userPreference: { locale } }: GlobalStore) => {
    return {
      locale,
    };
  });
  const configService = Container.get(IConfigService);
  const workLocale = useObserver(() => {
    let workLocale = 'en-US';

    if (configService.config?.privacyLocale.some(o => o === locale)) {
      workLocale = locale;
    }
    return workLocale;
  });

  const { loading, data: changelog } = useFetch(
    () => request.get(`${config.resourceHost}/privacy/PRIVACY.${workLocale}.md`),
    []
  );

  if (loading || !changelog) {
    return <Skeleton active />;
  }
  return <ReactMarkdown source={changelog} renderers={{ link: LinkRender }} />;
};

export default Changelog;
