import * as React from 'react';
import * as styles from './index.scss';
import { Button, Icon } from 'antd';
import Section from 'components/section';
import { SerializedExtensionWithId } from '../../extensions/interface';

type PageProps = {
  extensions: SerializedExtensionWithId[];
  pathname: string;
  onClick(router: string): void;
};

const ClipExtensions: React.FC<PageProps> = ({ extensions, pathname, onClick }) => {
  const handleClick = (pluginRouter: string) => {
    if (pluginRouter !== pathname) {
      onClick(pluginRouter);
    }
  };
  return (
    <Section title="剪藏格式" line>
      {extensions.map(plugin => {
        const useThisPlugin = plugin.router === pathname;
        const buttonStyle = useThisPlugin ? { color: '#40a9ff' } : {};
        return (
          <Button
            title={plugin.manifest.description}
            block
            key={plugin.id}
            className={styles.menuButton}
            style={buttonStyle}
            onClick={() => handleClick(plugin.router)}
          >
            <Icon type={plugin.manifest.icon} />
            {plugin.manifest.name}
          </Button>
        );
      })}
    </Section>
  );
};

export default ClipExtensions;
