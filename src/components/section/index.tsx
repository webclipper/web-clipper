import React from 'react';
import styles from './index.less';

interface Props {
  title?: string | React.ReactNode;
  className?: string;
}

const Section: React.FC<Props> = ({ title, children, className }) => {
  return (
    <div className={className}>
      {title && <h1 className={styles.sectionTitle}>{title}</h1>}
      {children}
    </div>
  );
};
export default Section;
