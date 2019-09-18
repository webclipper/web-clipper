import React from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/lib/icon';
import useFetchGithubFile from '@/common/hooks/useFetchGithubFile';
import iconConfig from '@/../config.json';

export default (props: IconProps) => {
  const [loading, config] = useFetchGithubFile('config.json');
  if (loading || !config) {
    return <Icon {...props}></Icon>;
  }
  let scriptUrl = JSON.parse(config).iconfont;
  if (process.env.NODE_ENV === 'development') {
    scriptUrl = iconConfig.iconfont;
  }
  const IconFont = Icon.createFromIconfontCN({
    scriptUrl,
  });
  return <IconFont {...props}></IconFont>;
};
