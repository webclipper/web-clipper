import React from 'react';
import { Skeleton } from 'antd';
import ReactMarkdown from 'react-markdown';
import LinkRender from '@/components/LinkRender';
import Container from 'typedi';
import { useFetch } from '@shihengtech/hooks';
import { IEnvironmentService } from '@/services/environment/common/environment';

const Privacy: React.FC = () => {
  const environmentService = Container.get(IEnvironmentService);
  const { loading, data: privacy } = useFetch(async () => {
    return environmentService.privacy();
  }, []);

  if (loading || !privacy) {
    return <Skeleton active />;
  }
  return <ReactMarkdown components={{ a: LinkRender } as any}>{privacy}</ReactMarkdown>;
};

export default Privacy;
