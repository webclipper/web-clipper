import * as React from 'react';
import { Icon } from 'antd';
import * as styles from './index.scss';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <Icon type="loading" />
      <span>正在加载语雀剪藏</span>
    </div>
  );
};
export default Loading;
