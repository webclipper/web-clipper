import * as React from 'react';
import styles from './index.less';
import { Button } from 'antd';
import Section from 'components/section';
import { SerializedExtensionWithId } from '@web-clipper/extensions';
import { FormattedMessage } from 'react-intl';
import IconFont from '@/components/IconFont';

type ToolExtensionsProps = {
  extensions: SerializedExtensionWithId[];
  onClick(router: SerializedExtensionWithId): void;
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
