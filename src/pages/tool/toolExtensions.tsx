import * as React from 'react';
import * as styles from './index.scss';
import { Button, Icon } from 'antd';

import { SerializedExtensionWithId } from '../../extensions/interface';

type PageProps = {
  extensions: SerializedExtensionWithId[];
  onClick(router: SerializedExtensionWithId): void;
};

export default class Page extends React.PureComponent<PageProps> {
  render() {
    const { extensions } = this.props;
    return (
      <React.Fragment>
        <section className={`${styles.section} ${styles.sectionLine}`}>
          <h1 className={styles.sectionTitle}>扩展</h1>
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
        </section>
      </React.Fragment>
    );
  }
}
