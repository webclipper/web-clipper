import * as React from 'react';
import { List, Icon, Avatar } from 'antd';
import * as styles from './index.scss';

interface PageProps {
  icon: string;
  name: string;
  remark?: string;
  id: string;
}

export default class Page extends React.Component<PageProps> {
  render() {
    const { name, remark = '暂无描述', icon } = this.props;
    let avatar;

    if (icon.startsWith('http')) {
      avatar = <Avatar src={icon} className={styles.avatar} />;
    } else {
      avatar = <Icon type={icon} style={{ fontSize: 32 }} />;
    }

    return (
      <List.Item>
        <List.Item.Meta avatar={avatar} title={<div>{name}</div>} description={remark} />
      </List.Item>
    );
  }
}
