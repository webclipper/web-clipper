import * as React from 'react';
import * as styles from './index.scss';
import {
  asyncChangeAccount,
  asyncCreateDocument,
  selectRepository,
  updateTitle,
} from '../../store/actions/clipper';
import {
  asyncRunExtension,
  asyncHideTool,
} from '../../store/actions/userPreference';
import { Avatar, Button, Icon, Input, Select } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { emptyFunction } from '../../utils';
import { push } from 'connected-react-router';
import { ToolContainer } from '../../components/container';
import { isEqual } from 'lodash';
import {
  SerializedExtensionWithId,
  ExtensionType,
  InitContext,
} from '../../extensions/interface';

const useActions = {
  asyncHideTool: asyncHideTool.started,
  asyncRunExtension: asyncRunExtension.started,
  asyncChangeAccount: asyncChangeAccount.started,
  asyncCreateDocument: asyncCreateDocument.started,
  updateTitle,
  selectRepository: selectRepository,
  uploadImage: emptyFunction,
  push,
};

const Option = Select.Option;

const mapStateToProps = ({
  clipper: {
    currentAccountId,
    title,
    url,
    creatingDocument,
    currentRepository,
    repositories,
    loadingRepositories,
  },
  userPreference: { accounts, extensions },
  router,
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);
  return {
    accounts,
    extensions,
    url,
    router,
    creatingDocument,
    loadingRepositories,
    currentAccountId,
    title,
    currentRepository,
    currentAccount,
    repositories,
  };
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

class Page extends React.Component<PageProps> {
  shouldComponentUpdate = (nextProps: PageProps) => {
    const selector = ({
      creatingDocument,
      repositories,
      currentAccount,
      currentRepository,
      loadingRepositories,
      title,
      router: {
        location: { pathname },
      },
    }: PageProps) => {
      return {
        currentRepository,
        creatingDocument,
        loadingRepositories,
        repositories,
        currentAccount,
        title,
        pathname,
      };
    };
    if (!isEqual(selector(nextProps), selector(this.props))) {
      return true;
    }
    return false;
  };

  onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.updateTitle({
      title: e.target.value,
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

  render() {
    const {
      creatingDocument,
      title,
      repositories,
      currentAccount,
      currentRepository,
      loadingRepositories,
      extensions,
      url,
      router,
    } = this.props;

    let repositoryId;
    if (currentAccount) {
      repositoryId = currentAccount.defaultRepositoryId;
    }
    if (currentRepository) {
      repositoryId = currentRepository.id;
    }

    const enableExtensions: SerializedExtensionWithId[] = extensions.filter(
      (o: SerializedExtensionWithId) => {
        if (o.init) {
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const context: InitContext = {
            accountInfo: {
              type: currentAccount && currentAccount.type,
            },
            url,
            pathname: router.location.pathname,
          };
          // eslint-disable-next-line no-eval
          return eval(o.init);
        }
        return true;
      }
    );

    const toolExtensions: SerializedExtensionWithId[] = enableExtensions.filter(
      o => o.type === ExtensionType.Tool
    );

    const clipExtensions: SerializedExtensionWithId[] = enableExtensions.filter(
      o => o.type !== ExtensionType.Tool
    );

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
              this.props.asyncCreateDocument();
            }}
            block
          >
            保存内容
          </Button>
        </section>
        <section className={`${styles.section} ${styles.sectionLine}`}>
          <h1 className={styles.sectionTitle}>扩展</h1>
          {toolExtensions.map(o => (
            <Button
              key={o.id}
              className={styles.menuButton}
              title={o.manifest.description}
              onClick={() => {
                this.props.asyncRunExtension({ extension: o });
              }}
            >
              <Icon type={o.manifest.icon} />
            </Button>
          ))}
        </section>
        <section className={`${styles.section} ${styles.sectionLine}`}>
          <h1 className={styles.sectionTitle}>剪藏格式</h1>

          {clipExtensions.map(plugin => (
            <Button
              title={plugin.manifest.description}
              block
              key={plugin.id}
              className={styles.menuButton}
              style={
                plugin.id === this.props.router.location.pathname
                  ? { color: '#40a9ff' }
                  : {}
              }
              onClick={() => {
                if (plugin.id !== this.props.router.location.pathname) {
                  this.props.push('/plugins/' + plugin.id);
                }
              }}
            >
              <Icon type={plugin.manifest.icon} />
              {plugin.manifest.name}
            </Button>
          ))}
        </section>
        <section className={styles.section}>
          <h1 className={styles.sectionTitle}>保存的知识库</h1>
          <Select
            loading={loadingRepositories}
            disabled={loadingRepositories}
            onSelect={this.onRepositorySelect}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
            filterOption={this.onFilterOption}
            dropdownMatchSelectWidth={true}
            value={repositoryId}
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
