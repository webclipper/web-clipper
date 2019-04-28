import * as React from 'react';
import * as styles from './index.scss';
import { Button, Icon } from 'antd';
import Section from 'components/section';

import { SerializedExtensionWithId } from '../../extensions/interface';

type PageProps = {
  extensions: SerializedExtensionWithId[];
  onClick(router: SerializedExtensionWithId): void;
};

export default class Page extends React.PureComponent<PageProps> {
  render() {
    const { extensions } = this.props;
    return (
      <Section line title="扩展">
        {extensions.map(o => (
          <Button
            key={o.id}
            className={styles.menuButton}
            title={o.manifest.description}
            onClick={() => this.props.onClick(o)}
          >
            <Icon type={o.manifest.icon} />
          </Button>
        ))}
      </Section>
    );
  }
}
