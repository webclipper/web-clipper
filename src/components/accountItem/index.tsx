import * as React from 'react';
import { Button, Icon } from 'antd';
import * as styles from './index.scss';
import { FormattedMessage } from 'react-intl';

interface PageProps {
  isDefault: boolean;
  id: string;
  name: string | React.ReactNode;
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
          <Icon type="star" style={tagStyle} onClick={this.handleSetDefaultAccount} />
        </div>
        <div className={styles.userInfo}>
          <img className={styles.avatar} src={avatar} />
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
          <Button type="danger" onClick={this.handleDelete}>
            <FormattedMessage
              id="component.accountItem.delete"
              defaultMessage="Delete"
            ></FormattedMessage>
          </Button>
        </div>
      </div>
    );
  }
}
