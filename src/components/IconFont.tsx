import React, { useMemo } from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/lib/icon';
import { useSelector } from 'dva';
import { GlobalStore } from '@/common/types';

const IconFont: React.FC<IconProps> = props => {
  const { scriptUrl, iconfontIcons } = useSelector(
    ({ userPreference: { iconfontUrl, iconfontIcons } }: GlobalStore) => ({
      scriptUrl: iconfontUrl,
      iconfontIcons,
    })
  );
  const iconsSet = useMemo(() => {
    return new Set(iconfontIcons);
  }, [iconfontIcons]);
  if (!iconsSet.has(props.type!)) {
    return <Icon {...props}></Icon>;
  }
  const IconFont = Icon.createFromIconfontCN({ scriptUrl });
  return <IconFont {...props}></IconFont>;
};

export default IconFont;
