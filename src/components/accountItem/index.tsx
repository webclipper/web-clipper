import * as React from 'react';
import { StarOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import styles from './index.less';
import { FormattedMessage } from 'react-intl';
import IconAvatar from '@/components/avatar';

interface PageProps {
  isDefault: boolean;
  id: string;
  name: string;
  avatar: string;
  description?: string;
  onEdit(id: string): void;
  onDelete(id: string): void;
  onSetDefaultAccount(id: string): void;
}

export default class Page extends React.Component<PageProps> {
  handleEdit = () => {
    this.props.onEdit(this.props.id);
  };

  handleDelete = () => {
    this.props.onDelete(this.props.id);
  };

  handleSetDefaultAccount = () => {
    this.props.onSetDefaultAccount(this.props.id);
  };

  render() {
    const { name, description, avatar, isDefault } = this.props;
    let tagStyle;
    if (isDefault) {
      tagStyle = { color: 'red' };
    }
    return (
      <div className={styles.card}>
        <div className={styles.star}>
          <StarOutlined style={tagStyle} onClick={this.handleSetDefaultAccount} />
        </div>
        <div className={styles.userInfo}>
          <IconAvatar size={96} avatar={avatar} icon={avatar} />
          <div className={styles.name}>{name}</div>
          <div className={styles.description}>{description}</div>
        </div>
        <div className={styles.operation}>
          <Button className={styles.editButton} type="primary" onClick={this.handleEdit}>
            <FormattedMessage
              id="component.accountItem.edit"
              defaultMessage="Edit"
            ></FormattedMessage>
          </Button>
          <Button type="primary" danger onClick={this.handleDelete}>
            <FormattedMessage id="component.accountItem.delete" defaultMessage="Delete" />
          </Button>
        </div>
      </div>
    );
  }
}
