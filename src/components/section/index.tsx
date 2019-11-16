import * as React from 'react';
import { Divider } from 'antd';
import styles from './index.scss';
import classNames from 'classnames';

interface Props {
  title?: string | React.ReactNode;
  line?: boolean;
  className?: string;
}

const Section: React.FC<Props> = ({ line = false, title, children, className }) => (
  <div className={classNames(styles.section, className)}>
    {line && <Divider style={{ marginBottom: 16 }} />}
    {title && <h1 className={styles.sectionTitle}>{title}</h1>}
    {children}
  </div>
);

export default Section;
