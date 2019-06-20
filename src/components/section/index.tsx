import * as React from 'react';
import { Divider } from 'antd';
import styles from './index.scss';

interface Props {
  title?: string;
  line?: boolean;
}

const Section: React.FC<Props> = ({ line = false, title, children }) => (
  <div className={styles.section}>
    {line && <Divider style={{ marginBottom: 16 }} />}
    {title && <h1 className={styles.sectionTitle}>{title}</h1>}
    {children}
  </div>
);

export default Section;
