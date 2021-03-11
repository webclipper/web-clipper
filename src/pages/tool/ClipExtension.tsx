import * as React from 'react';
import styles from './index.less';
import { Button } from 'antd';
import Section from 'components/section';
import { FormattedMessage } from 'react-intl';
import IconFont from '@/components/IconFont';
import { IExtensionWithId } from '@/extensions/common';
import localeService from '@/common/locales';

type PageProps = {
  hasEditor: boolean;
  extensions: IExtensionWithId[];
  pathname: string;
  onClick(router: string): void;
};

const ClipExtensions: React.FC<PageProps> = ({ extensions, pathname, onClick, hasEditor }) => {
  const handleClick = (pluginRouter: string) => {
    if (pluginRouter !== pathname) {
      onClick(pluginRouter);
    }
  };
  return (
    <Section
      className={styles.section}
      title={<FormattedMessage id="tool.clipExtensions" defaultMessage="Clip Extensions" />}
    >
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
            <IconFont type={plugin.manifest.icon} />
            {plugin.manifest.name}
          </Button>
        );
      })}
      {hasEditor && (
        <Button
          block
          key={'/editor'}
          className={styles.menuButton}
          style={pathname === '/editor' ? { color: '#40a9ff' } : {}}
          onClick={() => handleClick('/editor')}
        >
          <IconFont type={'select'} />
          {localeService.format({ id: 'contextMenus.selection.save.title' })}
        </Button>
      )}
    </Section>
  );
};

export default ClipExtensions;
