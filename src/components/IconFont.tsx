import React from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/lib/icon';
import { useSelector } from 'dva';
import { GlobalStore } from '@/common/types';

const IconFont: React.FC<IconProps> = props => {
  const option = useSelector(({ userPreference: { iconfontUrl } }: GlobalStore) => ({
    scriptUrl: iconfontUrl,
  }));

  const IconFont = Icon.createFromIconfontCN(option);
  return <IconFont {...props}></IconFont>;
};

export default IconFont;
