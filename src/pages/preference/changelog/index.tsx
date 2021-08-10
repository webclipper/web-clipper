import React from 'react';
import { Skeleton } from 'antd';
import ReactMarkdown from 'react-markdown';
import Container from 'typedi';
import { useFetch } from '@shihengtech/hooks';
import LinkRender from '@/components/LinkRender';
import { IEnvironmentService } from '@/services/environment/common/environment';

const Changelog: React.FC = () => {
  const environmentService = Container.get(IEnvironmentService);
  const { loading, data: changelog } = useFetch(async () => {
    return environmentService.changelog();
  }, []);

  if (loading || !changelog) {
    return <Skeleton active />;
  }
  return <ReactMarkdown components={{ a: LinkRender } as any}>{changelog}</ReactMarkdown>;
};

export default Changelog;
