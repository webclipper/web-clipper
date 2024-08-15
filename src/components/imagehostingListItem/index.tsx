import * as React from 'react';
import { List, Avatar } from 'antd';
import styles from './index.less';
import { FormattedMessage } from 'react-intl';
import IconFont from '@/components/IconFont';

interface PageProps {
  icon: string;
  name: string;
  remark?: string;
  id: string;
  onEditAccount: (id: string) => void;
  onDeleteAccount: (id: string) => void;
}

export default class Page extends React.Component<PageProps> {
  handleEditAccount = () => {
    const { onEditAccount, id } = this.props;
    if (onEditAccount) {
      onEditAccount(id);
    }
  };

  handleDeleteAccount = () => {
    const { onDeleteAccount, id } = this.props;
    if (onDeleteAccount) {
      onDeleteAccount(id);
    }
  };

  render() {
    const {
      name,
      remark = (
        <FormattedMessage id="component.imagehostingListItem.noDescription"></FormattedMessage>
      ),
      icon,
    } = this.props;
    let avatar;

    if (icon.startsWith('http') || icon.indexOf('/') != -1) {
      avatar = <Avatar src={icon} className={styles.avatar} />;
    } else {
      avatar = <IconFont type={icon} style={{ fontSize: 32 }} />;
    }

    const actions = [
      <a key="edit" onClick={this.handleEditAccount}>
        <FormattedMessage id="component.imagehostingListItem.edit" />
      </a>,
      <a key="delete" onClick={this.handleDeleteAccount}>
        <FormattedMessage id="component.imagehostingListItem.delete" />
      </a>,
    ];

    return (
      <List.Item actions={actions}>
        <List.Item.Meta avatar={avatar} title={<div>{name}</div>} description={remark} />
      </List.Item>
    );
  }
}
