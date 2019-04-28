import * as React from 'react';
import * as styles from './index.scss';
import { Divider } from 'antd';

interface Props {
  title?: string;
  line?: boolean;
}

export default class Section extends React.Component<Props> {
  public render() {
    const { title, line = false } = this.props;
    return (
      <div className={styles.section}>
        {line && <Divider className={styles.divider} />}
        {title && <h1 className={styles.sectionTitle}>{title}</h1>}
        {this.props.children}
      </div>
    );
  }
}
