import React, { useState, useEffect } from 'react';
import { GlobalStore, DvaRouterProps } from '@/common/types';
import { connect } from 'dva';
import { Skeleton } from 'antd';
import ReactMarkdown from 'react-markdown';
import Axios from 'axios';

const mapStateToProps = ({ userPreference: { locale } }: GlobalStore) => {
  return {
    locale,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & DvaRouterProps;

const supportedLocale = ['en-US', 'zh-CN'];

const useFetchChangelog = (locale: string) => {
  const [changelog, setChangelog] = useState<string>('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let workLocale = locale;
    if (supportedLocale.every(o => o !== locale)) {
      workLocale = 'en-US';
    }
    setLoading(true);
    Axios.get(
      `https://api.github.com/repos/webclipper/web-clipper/contents/src/changelog/CHANGELOG.${workLocale}.md`
    ).then(re => {
      setChangelog(decodeURIComponent(escape(window.atob(re.data.content))));
      setLoading(false);
    });
  }, [locale]);

  return { changelog, loading };
};

const Changelog: React.FC<PageProps> = props => {
  const { changelog, loading } = useFetchChangelog(props.locale);

  return (
    <React.Fragment>
      {loading ? <Skeleton active /> : <ReactMarkdown source={changelog} />}
    </React.Fragment>
  );
};

export default connect(mapStateToProps)(Changelog);
