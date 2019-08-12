import * as React from 'react';
import { List, Icon, Avatar, Popconfirm } from 'antd';
import * as styles from './index.scss';
import { FormattedMessage } from 'react-intl';

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
        <FormattedMessage
          id="component.imagehostingListItem.noDescription"
          defaultMessage="No Description"
        ></FormattedMessage>
      ),
      icon,
    } = this.props;
    let avatar;

    if (icon.startsWith('http')) {
      avatar = <Avatar src={icon} className={styles.avatar} />;
    } else {
      avatar = <Icon type={icon} style={{ fontSize: 32 }} />;
    }

    const actions = [
      <a key="edit" onClick={this.handleEditAccount}>
        <FormattedMessage
          id="component.imagehostingListItem.edit"
          defaultMessage="Edit"
        ></FormattedMessage>
      </a>,
      <Popconfirm
        key="delete"
        title="Are you sure？"
        okText="Yes"
        cancelText="No"
        onConfirm={this.handleDeleteAccount}
      >
        <a>
          <FormattedMessage
            id="component.imagehostingListItem.delete"
            defaultMessage="Delete"
          ></FormattedMessage>
        </a>
      </Popconfirm>,
    ];

    return (
      <List.Item actions={actions}>
        <List.Item.Meta avatar={avatar} title={<div>{name}</div>} description={remark} />
      </List.Item>
    );
  }
}
