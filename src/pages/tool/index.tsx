import * as React from 'react';
import * as styles from './index.scss';
import ClipExtensions from './clipExtensions';
import repositorySelectOptions from 'components/repositorySelectOptions';
import ToolExtensions from './toolExtensions';
import { Avatar, Button, Icon, Input, Select } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'dva';
import { GlobalStore } from '../../store/reducers/interface';
import { isEqual } from 'lodash';
import { push } from 'connected-react-router';
import { ToolContainer } from 'components/container';
import {
  asyncCreateDocument,
  updateTitle,
  selectRepository,
  asyncChangeAccount,
} from 'pageActions/clipper';
import { asyncHideTool, asyncRunExtension } from 'pageActions/userPreference';
import { SerializedExtensionWithId, ExtensionType, InitContext } from '../../extensions/interface';
import Section from 'components/section';

const useActions = {
  asyncHideTool: asyncHideTool.started,
  asyncRunExtension: asyncRunExtension.started,
  asyncChangeAccount: asyncChangeAccount.started,
  asyncCreateDocument: asyncCreateDocument.started,
  updateTitle,
  selectRepository: selectRepository,
  push,
};

const mapStateToProps = ({
  clipper: {
    currentAccountId,
    title,
    url,
    creatingDocument,
    currentRepository,
    repositories,
    loadingRepositories,
    currentImageHostingService,
  },
  userPreference: { accounts, extensions },
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);
  const usePlugin = true;
  const disableCreateDocument = !usePlugin || creatingDocument;
  return {
    accounts,
    extensions,
    currentImageHostingService,
    url,
    pathname: '',
    creatingDocument,
    loadingRepositories,
    currentAccountId,
    title,
    currentRepository,
    currentAccount,
    repositories,
    usePlugin,
    disableCreateDocument,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageDispatchProps = typeof useActions;
type PageProps = PageStateProps & PageDispatchProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(useActions, dispatch);

class Page extends React.Component<PageProps> {
  shouldComponentUpdate = (nextProps: PageProps) => {
    const selector = ({
      creatingDocument,
      repositories,
      currentAccount,
      currentRepository,
      loadingRepositories,
      title,
      pathname,
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

  onFilterOption = (select: any, option: React.ReactElement<any>) => {
    const title: string = option.props.children;
    return title.indexOf(select) !== -1;
  };

  handleCreateDocument = () => this.props.asyncCreateDocument();

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
      pathname,
      disableCreateDocument,
      currentImageHostingService,
    } = this.props;

    let repositoryId;
    if (currentAccount && repositories.some(o => o.id === currentAccount.defaultRepositoryId)) {
      repositoryId = currentAccount.defaultRepositoryId;
    }

    if (currentRepository) {
      repositoryId = currentRepository.id;
    }

    const enableExtensions: SerializedExtensionWithId[] = extensions.filter(o => {
      if (o.init) {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const context: InitContext = {
          accountInfo: {
            type: currentAccount && currentAccount.type,
          },
          url,
          pathname,
          currentImageHostingService,
        };
        // eslint-disable-next-line no-eval
        return eval(o.init);
      }
      return true;
    });

    const toolExtensions: SerializedExtensionWithId[] = enableExtensions.filter(
      o => o.type === ExtensionType.Tool
    );

    const clipExtensions: SerializedExtensionWithId[] = enableExtensions.filter(
      o => o.type !== ExtensionType.Tool
    );

    return (
      <ToolContainer onClickCloseButton={() => this.props.asyncHideTool()}>
        <Section title="笔记标题">
          <Input value={title} onChange={this.onTitleChange} />
          <Button
            className={styles.saveButton}
            style={{ marginTop: 16 }}
            size="large"
            type="primary"
            loading={creatingDocument}
            disabled={disableCreateDocument}
            onClick={this.handleCreateDocument}
            block
          >
            保存内容
          </Button>
        </Section>
        <ToolExtensions
          extensions={toolExtensions}
          onClick={extension => this.props.asyncRunExtension({ extension })}
        />
        <ClipExtensions
          extensions={clipExtensions}
          onClick={router => this.props.push(router)}
          pathname={pathname}
        />
        <Section title="保存的知识库">
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
            {repositorySelectOptions(repositories)}
          </Select>
        </Section>
        <Section line>
          <div className={styles.toolbar}>
            <Button
              className={`${styles.toolbarButton} `}
              onClick={() => {
                if (pathname === '/preference') {
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
              onSelect={(value: string) => {
                this.props.asyncChangeAccount({ id: value });
              }}
            >
              {this.props.accounts.map(o => (
                <Select.Option key={o.id || '1'}>
                  <Avatar size="small" src={o.avatar} />
                </Select.Option>
              ))}
            </Select>
          </div>
        </Section>
      </ToolContainer>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
