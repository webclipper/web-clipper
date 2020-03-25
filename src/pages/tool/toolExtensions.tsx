import * as React from 'react';
import styles from './index.less';
import { Button } from 'antd';
import Section from 'components/section';
import { FormattedMessage } from 'react-intl';
import IconFont from '@/components/IconFont';
import { IExtensionWithId } from '@/extensions/common';

type ToolExtensionsProps = {
  extensions: IExtensionWithId[];
  onClick(router: IExtensionWithId): void;
};

const ToolExtensions: React.FC<ToolExtensionsProps> = ({ extensions, onClick }) => {
  if (extensions.length === 0) {
    return null;
  }
  return (
    <Section
      className={styles.section}
      title={
        <FormattedMessage
          id="tool.toolExtensions"
          defaultMessage="Tool Extensions"
        ></FormattedMessage>
      }
    >
      {extensions.map(o => (
        <Button
          key={o.id}
          className={styles.menuButton}
          title={o.manifest.description}
          onClick={() => onClick(o)}
        >
          <IconFont type={o.manifest.icon} />
        </Button>
      ))}
    </Section>
  );
};

export default ToolExtensions;
