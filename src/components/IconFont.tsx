import React from 'react';
import { Icon } from 'antd';
import { IconProps } from 'antd/lib/icon';
import Container from 'typedi';
import { IConfigService } from '@/service/common/config';
import { Observer, useObserver } from 'mobx-react';

const IconFont: React.FC<IconProps> = props => {
  const configService = Container.get(IConfigService);
  const IconFont = useObserver(() => {
    return Icon.createFromIconfontCN({ scriptUrl: configService.config?.iconfont });
  });
  return (
    <Observer>
      {() => {
        if (!configService.remoteIconSet.has(props.type)) {
          return <Icon {...props} />;
        }
        return <IconFont {...props} />;
      }}
    </Observer>
  );
};

export default IconFont;
