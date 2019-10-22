import React, { useEffect } from 'react';
import * as styles from './index.scss';
import ClipExtension from './ClipExtension';
import repositorySelectOptions from 'components/repositorySelectOptions';
import ToolExtensions from './toolExtensions';
import { Avatar, Button, Icon, Input, Select, Badge } from 'antd';
import { connect, routerRedux } from 'dva';
import { GlobalStore } from '@/common/types';
import { isEqual } from 'lodash';
import { ToolContainer } from 'components/container';
import {
  asyncCreateDocument,
  updateTitle,
  selectRepository,
  asyncChangeAccount,
} from 'pageActions/clipper';
import { asyncHideTool, asyncRunExtension } from 'pageActions/userPreference';
import { SerializedExtensionWithId, InitContext } from '@web-clipper/extensions';
import Section from 'components/section';
import { DvaRouterProps } from 'common/types';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import { FormattedMessage } from 'react-intl';
import { trackEvent } from '@/common/gs';
import matchUrl from '@/common/matchUrl';
import IconFont from '@/components/IconFont';

const mapStateToProps = ({
  clipper: {
    currentAccountId,
    title,
    url,
    currentRepository,
    repositories,
    currentImageHostingService,
  },
  loading,
  account: { accounts, defaultAccountId },
  userPreference: { locale, servicesMeta },
  extension: { extensions, disabledExtensions },
  version: { hasUpdate },
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);
  const creatingDocument = loading.effects[asyncCreateDocument.started.type];
  const disableCreateDocument = creatingDocument;
  const loadingAccount = loading.effects[asyncChangeAccount.started.type];
  return {
    defaultAccountId,
    hasUpdate,
    loadingAccount,
    accounts,
    extensions: extensions
      .filter(o => !disabledExtensions.includes(o.id))
      .filter(o => {
        const matches = o.manifest.matches;
        if (Array.isArray(matches)) {
          return matches.some(o => matchUrl(o, url!));
        }
        return true;
      }),
    currentImageHostingService,
    url,
    creatingDocument,
    currentAccountId,
    title,
    currentRepository,
    currentAccount,
    repositories,
    disableCreateDocument,
    locale,
    servicesMeta,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & DvaRouterProps;

const Page = React.memo<PageProps>(
  props => {
    const {
      creatingDocument,
      title,
      repositories,
      currentAccount,
      currentRepository,
      loadingAccount,
      extensions,
      url,
      disableCreateDocument,
      currentImageHostingService,
      history: {
        location: { pathname },
      },
      dispatch,
      hasUpdate,
      accounts,
      servicesMeta,
    } = props;

    useEffect(() => {
      if (pathname === '/') {
        trackEvent('LoadPage', pathname);
        if (accounts.length === 0) {
          dispatch(routerRedux.push('/preference/account'));
          return;
        }
      }
    }, [accounts.length, dispatch, pathname]);

    const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        updateTitle({
          title: e.target.value,
        })
      );
    };

    const onRepositorySelect = (repositoryId: string) => {
      dispatch(selectRepository({ repositoryId }));
    };

    const onFilterOption = (select: any, option: React.ReactElement<any>) => {
      const title: string = option.props.children;
      return title.indexOf(select) !== -1;
    };

    const handleCreateDocument = () =>
      dispatch(asyncCreateDocument.started({ pathname: props.history.location.pathname }));

    const push = (path: string) => dispatch(routerRedux.push(path));

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
          locale: props.locale,
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

    const [toolExtensions, clipExtensions] = useFilterExtensions(enableExtensions);

    return (
      <ToolContainer onClickCloseButton={() => dispatch(asyncHideTool.started())}>
        <Section title={<FormattedMessage id="tool.title" />}>
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
            {<FormattedMessage id="tool.save" defaultMessage="Save Content" />}
          </Button>
        </Section>
        <ToolExtensions
          extensions={toolExtensions}
          onClick={extension =>
            dispatch(
              asyncRunExtension.started({
                pathname,
                extension,
              })
            )
          }
        />
        <ClipExtension
          extensions={clipExtensions}
          onClick={router => push(router)}
          pathname={pathname}
        />
        <Section title={<FormattedMessage id="tool.repository"></FormattedMessage>}>
          <Select
            loading={loadingAccount}
            disabled={loadingAccount}
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
                if (pathname.startsWith('/preference')) {
                  push('/');
                } else {
                  push('/preference/account');
                }
              }}
            >
              <Badge dot={hasUpdate}>
                <Icon type="setting" style={{ fontSize: 18 }} />
              </Badge>
            </Button>
            <Select
              value={props.currentAccountId}
              style={{ width: '75px' }}
              onSelect={(value: string) => dispatch(asyncChangeAccount.started({ id: value }))}
            >
              {props.accounts.map(o => (
                <Select.Option key={o.id || '1'}>
                  {(o.avatar || servicesMeta[o.type].icon).startsWith('http') ? (
                    <Avatar size="small" src={o.avatar} />
                  ) : (
                    <span
                      className="ant-avatar ant-avatar-sm ant-avatar-circle ant-avatar-icon"
                      style={{
                        background: 'unset',
                        color: 'unset',
                      }}
                    >
                      <IconFont
                        style={{ fontSize: 24 }}
                        type={o.avatar || servicesMeta[o.type].icon}
                      ></IconFont>
                    </span>
                  )}
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
      title,
      history,
      loadingAccount,
      locale,
      extensions,
      hasUpdate,
      servicesMeta,
    }: PageProps) => {
      return {
        loadingAccount,
        currentRepository,
        creatingDocument,
        repositories,
        currentAccount,
        title,
        pathname: history.location.pathname,
        locale,
        extensions,
        hasUpdate,
        servicesMeta,
      };
    };
    return isEqual(selector(prevProps), selector(nextProps));
  }
);

export default connect(mapStateToProps)(Page as React.FC<PageProps>);
