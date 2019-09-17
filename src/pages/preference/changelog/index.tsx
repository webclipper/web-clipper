import React from 'react';
import { GlobalStore, DvaRouterProps } from '@/common/types';
import { connect } from 'dva';
import { Skeleton } from 'antd';
import ReactMarkdown from 'react-markdown';
import useFetchGithubFile from '@/common/hooks/useFetchGithubFile';

const mapStateToProps = ({ userPreference: { locale } }: GlobalStore) => {
  return {
    locale,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & DvaRouterProps;

const supportedLocale = ['en-US', 'zh-CN'];

const Changelog: React.FC<PageProps> = ({ locale }) => {
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

export default connect(mapStateToProps)(Changelog);
