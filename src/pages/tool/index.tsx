import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { ToolContainer } from '../../components/container';
import { Button, Input, Icon, Select, Avatar } from 'antd';
import * as styles from './index.scss';
import { emptyFunction } from '../../utils';
import {
  updateTitle,
  asyncCreateDocument,
  cancelCreateRepository,
  selectRepository,
  asyncChangeAccount
} from '../../store/actions/clipper';
import { asyncHideTool } from '../../store/actions/userPreference';
import { push } from 'connected-react-router';
import Xxx from './dropdown';
import { plugins } from '../plugin/index';

const useActions = {
  asyncHideTool: asyncHideTool.started,
  asyncChangeAccount: asyncChangeAccount.started,
  postDocument: asyncCreateDocument.started,
  updateTitle,
  selectRepository: selectRepository,
  uploadImage: emptyFunction,
  push,
  onCancelCreate: cancelCreateRepository
};

const Option = Select.Option;

const mapStateToProps = ({
  userInfo,
  clipper: {
    currentAccountId,
    title,
    creatingDocument,
    currentRepository,
    repositories,
    loadingRepositories
  },
  userPreference: { accounts },
  router
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);
  return {
    accounts,
    plugins,
    router,
    createMode: true,
    creatingDocument,
    loadingRepositories: loadingRepositories,
    uploadingImage: true,
    avatar: userInfo.avatar,
    currentAccountId,
    userHomePage: userInfo.homePage,
    title: title,
    isCreateRepository: true,
    currentRepository,
    haveImageService: true,
    currentAccount,
    repositories: repositories
  };
};
type PageState = {
  openSelect: boolean;
};

type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageOwnProps = {};
type PageProps = PageStateProps & PageDispatchProps & PageOwnProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(
    useActions,
    dispatch
  );

class Page extends React.Component<PageProps, PageState> {
  private lock?: any = null;
  constructor(props: any) {
    super(props);
    this.state = {
      openSelect: false
    };
  }

  onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.updateTitle({
      title: e.target.value
    });
  };

  onRepositorySelect = (repositoryId: string) => {
    this.props.selectRepository({ repositoryId });
  };

  onSyncImage = () => {
    this.props.uploadImage();
  };

  onFilterOption = (select: any, option: React.ReactElement<any>) => {
    const title: string = option.props.children;
    return title.indexOf(select) !== -1;
  };

  onDropdownVisibleChange = (openSelect: boolean) => {
    if (this.lock) {
      return;
    }
    this.setState({ openSelect });
    if (!openSelect) {
      this.props.onCancelCreate();
    }
  };

  onLockSelect = () => {
    clearTimeout(this.lock);
    this.lock = setTimeout(() => {
      this.lock = null;
    }, 200);
  };

  render() {
    const {
      creatingDocument,
      title,
      repositories,
      currentAccount,
      currentRepository,
      loadingRepositories
    } = this.props;

    let repositoryId;
    if (currentAccount) {
      repositoryId = currentAccount.defaultRepositoryId;
    }
    if (currentRepository) {
      repositoryId = currentRepository.id;
    }

    return (
      <ToolContainer
        onClickCloseButton={() => {
          this.props.asyncHideTool();
        }}
      >
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>笔记标题</h1>
          <Input value={title} onChange={this.onTitleChange} />
          <Button
            className={styles.saveButton}
            style={{ marginTop: 16 }}
            size="large"
            type="primary"
            loading={creatingDocument}
            disabled={creatingDocument}
            onClick={() => {
              this.props.postDocument();
            }}
            block
          >
            保存内容
          </Button>
        </section>
        <section className={`${styles.section} ${styles.sectionLine}`}>
          <h1 className={styles.sectionTitle}>剪藏格式</h1>
          {this.props.plugins.map(plugin => (
            <Button
              title={plugin.description}
              block
              key={plugin.router}
              className={styles.menuButton}
              style={
                plugin.router === this.props.router.location.pathname
                  ? { color: '#40a9ff' }
                  : {}
              }
              onClick={() => {
                this.props.push(plugin.router);
              }}
            >
              <Icon type={plugin.icon} />
              {plugin.name}
            </Button>
          ))}
        </section>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>保存的知识库</h1>
          <Select
            onDropdownVisibleChange={this.onDropdownVisibleChange}
            open={this.state.openSelect}
            loading={loadingRepositories}
            disabled={loadingRepositories}
            onSelect={this.onRepositorySelect}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
            filterOption={this.onFilterOption}
            dropdownMatchSelectWidth={true}
            value={repositoryId}
            dropdownRender={main => {
              return <Xxx onLockSelect={this.onLockSelect}>{main}</Xxx>;
            }}
          >
            {repositories.map(o => {
              return (
                <Option key={o.id.toString()} value={o.id}>
                  {o.name}
                </Option>
              );
            })}
          </Select>
        </section>

        <section className={`${styles.toolbar} ${styles.sectionLine}`}>
          <Button
            className={`${styles.toolbarButton} `}
            onClick={() => {
              if (this.props.router.location.pathname === '/preference') {
                this.props.push('/');
              } else {
                this.props.push('/preference');
              }
            }}
          >
            <Icon type="setting" />
          </Button>
          <Select
            value={this.props.currentAccountId}
            style={{ width: '75px' }}
            onSelect={value => {
              this.props.asyncChangeAccount({ id: value });
            }}
          >
            {this.props.accounts.map(o => (
              <Select.Option key={o.id || '1'}>
                <Avatar size="small" src={o.avatar} />
              </Select.Option>
            ))}
          </Select>
        </section>
      </ToolContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page as React.ComponentType<PageProps>);
