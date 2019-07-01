import * as React from 'react';
import * as styles from './index.scss';
import ClipExtensions from './clipExtensions';
import repositorySelectOptions from 'components/repositorySelectOptions';
import ToolExtensions from './toolExtensions';
import { Avatar, Button, Icon, Input, Select } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { connect, routerRedux } from 'dva';
import { GlobalStore } from '../../store/reducers/interface';
import { isEqual } from 'lodash';
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
import { DvaRouterProps } from 'common/types';

const useActions = {
  asyncHideTool: asyncHideTool.started,
  asyncRunExtension: asyncRunExtension.started,
  asyncChangeAccount: asyncChangeAccount.started,
  asyncCreateDocument: asyncCreateDocument.started,
  updateTitle,
  selectRepository: selectRepository,
  push: routerRedux.push,
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
type PageProps = PageStateProps & PageDispatchProps & DvaRouterProps;
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators<PageDispatchProps, PageDispatchProps>(useActions, dispatch);

const Page = React.memo<PageProps>(
  props => {
    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      props.updateTitle({
        title: e.target.value,
      });
    };

    const onRepositorySelect = (repositoryId: string) => {
      props.selectRepository({ repositoryId });
    };

    const onFilterOption = (select: any, option: React.ReactElement<any>) => {
      const title: string = option.props.children;
      return title.indexOf(select) !== -1;
    };

    const handleCreateDocument = () =>
      props.asyncCreateDocument({ pathname: props.history.location.pathname });

    const {
      creatingDocument,
      title,
      repositories,
      currentAccount,
      currentRepository,
      loadingRepositories,
      extensions,
      url,
      disableCreateDocument,
      currentImageHostingService,
    } = props;

    const { pathname } = props.history.location;

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
      <ToolContainer onClickCloseButton={() => props.asyncHideTool()}>
        <Section title="笔记标题">
          <Input value={title} onChange={onTitleChange} />
          <Button
            className={styles.saveButton}
            style={{ marginTop: 16 }}
            size="large"
            type="primary"
            loading={creatingDocument}
            disabled={disableCreateDocument}
            onClick={handleCreateDocument}
            block
          >
            保存内容
          </Button>
        </Section>
        <ToolExtensions
          extensions={toolExtensions}
          onClick={extension =>
            props.asyncRunExtension({
              pathname,
              extension,
            })
          }
        />
        <ClipExtensions
          extensions={clipExtensions}
          onClick={router => {
            props.push(router);
          }}
          pathname={pathname}
        />
        <Section title="保存的知识库">
          <Select
            loading={loadingRepositories}
            disabled={loadingRepositories}
            onSelect={onRepositorySelect}
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="children"
            filterOption={onFilterOption}
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
                  props.push('/');
                } else {
                  props.push('/preference');
                }
              }}
            >
              <Icon type="setting" />
            </Button>
            <Select
              value={props.currentAccountId}
              style={{ width: '75px' }}
              onSelect={(value: string) => {
                props.asyncChangeAccount({ id: value });
              }}
            >
              {props.accounts.map(o => (
                <Select.Option key={o.id || '1'}>
                  <Avatar size="small" src={o.avatar} />
                </Select.Option>
              ))}
            </Select>
          </div>
        </Section>
      </ToolContainer>
    );
  },
  (prevProps: PageProps, nextProps: PageProps) => {
    const selector = ({
      creatingDocument,
      repositories,
      currentAccount,
      currentRepository,
      loadingRepositories,
      title,
      history,
    }: PageProps) => {
      return {
        currentRepository,
        creatingDocument,
        loadingRepositories,
        repositories,
        currentAccount,
        title,
        pathname: history.location.pathname,
      };
    };
    return isEqual(selector(prevProps), selector(nextProps));
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
