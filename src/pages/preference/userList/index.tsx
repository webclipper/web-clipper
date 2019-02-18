import * as React from 'react';
import CreateAccountModal from './createAccountModal';
import {
  asyncDeleteAccount,
  asyncUpdateCurrentAccountIndex,
  startCreateAccount
} from '../../../store/actions/userPreference';
import { Avatar, Button, Card, Icon, List, Modal } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

const useActions = {
  startCreateAccount,
  asyncDeleteAccount: asyncDeleteAccount.started,
  asyncUpdateCurrentAccountIndex: asyncUpdateCurrentAccountIndex.started
};

const mapStateToProps = ({
  userPreference: { accounts, defaultAccountId }
}: GlobalStore) => {
  return {
    accounts,
    defaultAccountId
  };
};
type PageState = {};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {};
type PageProps = PageStateProps & PageDispatchProps & PageOwnProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

const defaultDescription = '还没有个人资料';

const typeToIcon = (type: string) => {
  let map = new Map<string, { icon: string; href: string }>();
  map.set('yuque', { icon: 'yuque', href: 'https://www.yuque.com' });
  map.set('github', { icon: 'github', href: 'https://github.com/' });

  const data = map.get(type);
  if (data) {
    return (
      <a href={data.href} target='blank'>
        <Icon type={data.icon} />
      </a>
    );
  }
  return <div>{type}</div>;
};

const cardMeta = (avatar: string | undefined, name: string) => {
  return (
    <Card.Meta
      avatar={avatar ? <Avatar src={avatar} /> : <Avatar icon='user' />}
      title={name}
    />
  );
};

class Page extends React.Component<PageProps, PageState> {
  onDeleteAccount = (index: number) => {
    let that = this;
    Modal.confirm({
      title: '你确定要删除这个账户吗？',
      onOk() {
        let account = that.props.accounts[index];
        that.props.asyncDeleteAccount({ id: account.id });
      }
    });
  };

  onSetDefaultAccount = (index: number) => {
    let account = this.props.accounts[index];
    this.props.asyncUpdateCurrentAccountIndex({
      id: account.id
    });
  };

  render() {
    return (
      <React.Fragment>
        <CreateAccountModal />
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            overflow: 'hidden'
          }}
        >
          <List.Item>
            <Button
              type='dashed'
              onClick={() => {
                this.props.startCreateAccount();
              }}
              style={{ width: '300px', height: '200px', margin: '10px' }}
            >
              <Icon type='plus' /> 绑定账户
            </Button>
          </List.Item>
          {this.props.accounts.map((account, index) => (
            <List.Item key={account.accessToken}>
              <Card
                style={{
                  width: '300px',
                  height: '200px',
                  margin: '10px'
                }}
                title={cardMeta(account.avatar, account.name)}
                extra={typeToIcon(account.type)}
                actions={[
                  <Icon
                    key='heart'
                    type='heart'
                    title={
                      this.props.accounts[index].id ===
                      this.props.defaultAccountId
                        ? '默认账户'
                        : '设置为默认账户'
                    }
                    theme={
                      this.props.accounts[index].id ===
                      this.props.defaultAccountId
                        ? 'filled'
                        : 'outlined'
                    }
                    onClick={this.onSetDefaultAccount.bind(this, index)}
                  />,
                  <Icon
                    key='delete'
                    type='delete'
                    title='删除'
                    onClick={this.onDeleteAccount.bind(this, index)}
                  />
                ]}
              >
                <div style={{ height: '46px', overflow: 'hidden' }}>
                  {account.description || defaultDescription}
                </div>
              </Card>
            </List.Item>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
