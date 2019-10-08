import React from 'react';
import { GlobalStore } from '@/common/types';
import { useSelector } from 'dva';
import { Skeleton } from 'antd';
import ReactMarkdown from 'react-markdown';
import useFetchGithubFile from '@/common/hooks/useFetchGithubFile';

const supportedLocale = ['en-US', 'zh-CN'];

const Changelog: React.FC = () => {
  const { locale } = useSelector(({ userPreference: { locale } }: GlobalStore) => {
    return {
      locale,
    };
  });
  let workLocale = locale;
  if (supportedLocale.every(o => o !== locale)) {
    workLocale = 'en-US';
  }
  const [loading, changelog] = useFetchGithubFile(`src/changelog/CHANGELOG.${workLocale}.md`);
  if (loading || !changelog) {
    return <Skeleton active />;
  }
  return <ReactMarkdown source={changelog} />;
};

export default Changelog;
