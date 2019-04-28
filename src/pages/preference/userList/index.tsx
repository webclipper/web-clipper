import * as React from 'react';
import {
  asyncAddAccount,
  resetAccountForm,
  asyncDeleteAccount,
  asyncUpdateCurrentAccountIndex,
  asyncVerificationAccessToken,
  asyncUpdateAccount,
} from 'actions';
import { Icon, Button, Form, Row, Col } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import AccountItem from '../../../components/accountItem';
import * as styles from './index.scss';
import EditAccountModal from './modal/editAccountModal';
import { FormComponentProps } from 'antd/lib/form';
import CreateAccountModal from './modal/createAccountModal';
import { GlobalStore } from '../../../store/reducers/interface';
import { AccountPreference } from '../../../store/reducers/userPreference/interface';

const useActions = {
  resetAccountForm,
  asyncAddAccount: asyncAddAccount.started,
  asyncDeleteAccount: asyncDeleteAccount.started,
  asyncUpdateAccount: asyncUpdateAccount.started,
  asyncUpdateCurrentAccountIndex: asyncUpdateCurrentAccountIndex.started,
  asyncVerificationAccessToken: asyncVerificationAccessToken.started,
};

const mapStateToProps = ({
  userPreference: {
    accounts,
    defaultAccountId,
    servicesMeta,
    initializeForm,
    imageHostingServicesMeta,
    imageHosting,
  },
}: GlobalStore) => {
  return {
    imageHostingServicesMeta,
    accounts,
    defaultAccountId,
    servicesMeta,
    initializeForm,
    imageHosting,
  };
};
type PageState = {
  showAccountModal: boolean;
  currentAccount: null | AccountPreference;
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {};
type PageProps = PageStateProps &
  PageDispatchProps &
  PageOwnProps &
  FormComponentProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

class Page extends React.Component<PageProps, PageState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      showAccountModal: false,
      currentAccount: null,
    };
  }

  handleVerifiedAccount = () => {
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const { type, defaultRepositoryId, ...info } = values;
      this.props.asyncVerificationAccessToken({
        type,
        info,
      });
    });
  };

  handleSetDefaultId = (id: string) => {
    if (this.props.defaultAccountId === id) {
      return;
    }
    this.props.asyncUpdateCurrentAccountIndex({ id });
  };

  handleEdit = (accountId: string) => {
    const currentAccount = this.props.accounts.find(o => o.id === accountId);
    if (!currentAccount) {
      return;
    }
    const { type, defaultRepositoryId, imageHosting, ...info } = currentAccount;
    this.props.asyncVerificationAccessToken({
      type,
      info,
    });
    this.toggleAccountModal(currentAccount);
  };

  handleAdd = () => {
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const { type, defaultRepositoryId, imageHosting, ...info } = values;
      this.props.asyncAddAccount({
        type,
        defaultRepositoryId,
        imageHosting,
        info,
        callback: this.handleCancel,
      });
    });
  };

  handleCancel = () => {
    const { form, resetAccountForm } = this.props;
    form.resetFields();
    this.toggleAccountModal();
    resetAccountForm();
  };

  toggleAccountModal = (currentAccount?: AccountPreference) => {
    const { showAccountModal } = this.state;
    this.setState(
      {
        showAccountModal: !showAccountModal,
      },
      () => {
        this.setState({
          currentAccount: currentAccount || null,
        });
      }
    );
  };

  handleEditAccount = (id: string) => {
    const { form, asyncUpdateAccount } = this.props;
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const { type, defaultRepositoryId, imageHosting, ...info } = values;
      asyncUpdateAccount({
        account: { type, defaultRepositoryId, imageHosting, info },
        id,
        callback: this.handleCancel,
      });
    });
  };

  getAccountModal = () => {
    const { showAccountModal, currentAccount } = this.state;
    const {
      servicesMeta,
      form,
      imageHostingServicesMeta,
      imageHosting,
      initializeForm: { repositories, verified, verifying },
    } = this.props;
    if (!showAccountModal) {
      return;
    }
    if (currentAccount) {
      return (
        <EditAccountModal
          visible
          form={form}
          imageHosting={imageHosting}
          imageHostingServicesMeta={imageHostingServicesMeta}
          repositories={repositories}
          verified={verified}
          verifying={verifying}
          servicesMeta={servicesMeta}
          currentAccount={currentAccount}
          onCancel={this.handleCancel}
          onEdit={this.handleEditAccount}
        />
      );
    }
    return (
      <CreateAccountModal
        visible
        form={form}
        imageHosting={imageHosting}
        imageHostingServicesMeta={imageHostingServicesMeta}
        servicesMeta={servicesMeta}
        verified={verified}
        repositories={repositories}
        onVerifiedAccount={this.handleVerifiedAccount}
        onAdd={this.handleAdd}
        onCancel={this.handleCancel}
      />
    );
  };

  render() {
    const { defaultAccountId } = this.props;
    return (
      <React.Fragment>
        {this.getAccountModal()}
        <Row gutter={8}>
          {this.props.accounts.map(account => (
            <Col span={8} key={account.id}>
              <AccountItem
                isDefault={defaultAccountId === account.id}
                id={account.id}
                name={account.name}
                description={account.description}
                avatar={account.avatar}
                onDelete={id => this.props.asyncDeleteAccount({ id })}
                onEdit={id => this.handleEdit(id)}
                onSetDefaultAccount={id => this.handleSetDefaultId(id)}
              />
            </Col>
          ))}
          <Col span={8}>
            <div>
              <Button
                className={styles.createButton}
                type="dashed"
                onClick={() => this.toggleAccountModal()}
                block
              >
                <Icon type="plus" /> 绑定账户
              </Button>
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  //@ts-ignore
)(Form.create<PageProps>()(Page));
