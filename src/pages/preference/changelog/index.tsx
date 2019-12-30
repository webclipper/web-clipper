import React from 'react';
import { GlobalStore } from '@/common/types';
import { useSelector } from 'dva';
import { Skeleton } from 'antd';
import ReactMarkdown from 'react-markdown';
import useAsync from '@/common/hooks/useAsync';
import request from 'umi-request';
import config from '@/config';
import { IConfigService } from '@/service/common/config';
import Container from 'typedi';
import { useObserver } from 'mobx-react';

const Changelog: React.FC = () => {
  const { locale } = useSelector(({ userPreference: { locale } }: GlobalStore) => {
    return {
      locale,
    };
  });
  const configService = Container.get(IConfigService);
  const workLocale = useObserver(() => {
    let workLocale = 'en-US';
    if (configService.config?.changelogLocale.some(o => o === locale)) {
      workLocale = locale;
    }
    return workLocale;
  });

  const { loading, result: changelog } = useAsync(
    () => request.get(`${config.resourceHost}/changelog/CHANGELOG.${workLocale}.md`),
    []
  );

  if (loading || !changelog) {
    return <Skeleton active />;
  }
  return <ReactMarkdown source={changelog} />;
};

export default Changelog;
