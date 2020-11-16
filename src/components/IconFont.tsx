import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { IconProps } from '@ant-design/compatible/es/icon';
import { createFromIconfontCN } from '@ant-design/icons';
import Container from 'typedi';
import { IConfigService } from '@/service/common/config';
import { Observer, useObserver } from 'mobx-react';

const IconFont: React.FC<IconProps> = props => {
  const configService = Container.get(IConfigService);
  const IconFont = useObserver(() => {
    return createFromIconfontCN({ scriptUrl: 'icon.js' });
  });
  return (
    <Observer>
      {() => {
        if (!configService.remoteIconSet.has(props.type)) {
          return <LegacyIcon {...props} />;
        }
        if (!props.type) {
          throw new Error('Type is required');
        }
        return <IconFont {...props} type={props.type!} />;
      }}
    </Observer>
  );
};

export default IconFont;
