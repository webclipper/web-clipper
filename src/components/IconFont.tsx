import React from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/lib/icon';
import useFetchGithubFile from '@/common/hooks/useFetchGithubFile';

export default (props: IconProps) => {
  const [loading, config] = useFetchGithubFile('config.json');
  if (loading || !config) {
    return <Icon {...props}></Icon>;
  }
  const IconFont = Icon.createFromIconfontCN({
    scriptUrl: JSON.parse(config).iconfont,
  });
  return <IconFont {...props}></IconFont>;
};
