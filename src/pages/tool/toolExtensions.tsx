import * as React from 'react';
import * as styles from './index.scss';
import { Button, Icon } from 'antd';
import Section from 'components/section';

import { SerializedExtensionWithId } from '@web-clipper/extensions';
import { FormattedMessage } from 'react-intl';

type ToolExtensionsProps = {
  extensions: SerializedExtensionWithId[];
  onClick(router: SerializedExtensionWithId): void;
};

const ToolExtensions: React.FC<ToolExtensionsProps> = ({ extensions, onClick }) => {
  return (
    <Section
      line
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
          <Icon type={o.manifest.icon} />
        </Button>
      ))}
    </Section>
  );
};

export default ToolExtensions;
