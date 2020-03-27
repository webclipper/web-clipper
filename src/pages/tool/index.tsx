import React, { useEffect, useMemo, useCallback } from 'react';
import styles from './index.less';
import ClipExtension from './ClipExtension';
import ToolExtensions from './toolExtensions';
import { Button, Icon, Badge, Dropdown, Menu } from 'antd';
import { connect, routerRedux } from 'dva';
import { GlobalStore } from '@/common/types';
import { isEqual } from 'lodash';
import { ToolContainer } from 'components/container';
import { selectRepository, asyncChangeAccount } from 'pageActions/clipper';
import { asyncRunExtension } from 'pageActions/userPreference';
import { InitContext } from '@web-clipper/extensions';
import Section from 'components/section';
import { DvaRouterProps } from 'common/types';
import useFilterExtensions from '@/common/hooks/useFilterExtensions';
import { FormattedMessage } from 'react-intl';
import matchUrl from '@/common/matchUrl';
import Header from './Header';
import RepositorySelect from '@/components/RepositorySelect';
import Container from 'typedi';
import { IConfigService } from '@/service/common/config';
import { Observer, useObserver } from 'mobx-react';
import IconAvatar from '@/components/avatar';
import IconFont from '@/components/IconFont';
import UserItem from '@/components/userItem';
import { IContentScriptService } from '@/service/common/contentScript';
import { IExtensionService, IExtensionContainer } from '@/service/common/extension';
import { IExtensionWithId } from '@/extensions/common';
import usePowerpack from '@/common/hooks/usePowerpack';

const mapStateToProps = ({
  clipper: { currentAccountId, url, currentRepository, repositories, currentImageHostingService },
  loading,
  account: { accounts },
  userPreference: { locale, servicesMeta },
}: GlobalStore) => {
  const currentAccount = accounts.find(o => o.id === currentAccountId);
  const loadingAccount = loading.effects[asyncChangeAccount.started.type];
  return {
    loadingAccount,
    accounts,
    currentImageHostingService,
    url,
    currentAccountId,
    currentRepository,
    currentAccount,
    repositories,
    locale,
    servicesMeta,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;
type PageProps = PageStateProps & DvaRouterProps;

const Page = React.memo<PageProps>(
  props => {
    const extensionService = Container.get(IExtensionService);
    const {
      repositories,
      currentAccount,
      currentRepository,
      loadingAccount,
      url,
      currentImageHostingService,
      history: {
        location: { pathname },
      },
      dispatch,
      accounts,
      servicesMeta,
    } = props;

    const { valid } = usePowerpack();

    const extensions = useObserver(() => {
      return Container.get(IExtensionContainer)
        .extensions.filter(o => !extensionService.DisabledExtensionIds.includes(o.id))
        .filter(o => {
          if (!valid) {
            return !o.manifest.powerpack;
          }
          return true;
        })
        .filter(o => {
          const matches = o.manifest.matches;
          if (Array.isArray(matches)) {
            // eslint-disable-next-line max-nested-callbacks
            return matches.some(o => matchUrl(o, url!));
          }
          return true;
        });
    });

    const configService = Container.get(IConfigService);

    const currentService = currentAccount ? servicesMeta[currentAccount.type] : null;

    useEffect(() => {
      if (pathname === '/') {
        if (accounts.length === 0) {
          dispatch(routerRedux.push('/preference/account'));
          return;
        }
      }
    }, [accounts.length, dispatch, pathname]);

    const onRepositorySelect = useCallback(
      (repositoryId: string) => {
        dispatch(selectRepository({ repositoryId }));
      },
      [dispatch]
    );

    useEffect(() => {
      if (currentAccount && currentAccount.defaultRepositoryId) {
        onRepositorySelect(currentAccount.defaultRepositoryId);
      }
    }, [currentAccount, onRepositorySelect]);

    const push = (path: string) => dispatch(routerRedux.push(path));

    let repositoryId;
    if (currentRepository) {
      repositoryId = currentRepository.id;
    }

    const enableExtensions: IExtensionWithId[] = extensions.filter(o => {
      if (o.extensionLifeCycle.init) {
        const context: InitContext = {
          locale: props.locale,
          accountInfo: {
            type: currentAccount && currentAccount.type,
          },
          url,
          pathname,
          currentImageHostingService,
        };
        return o.extensionLifeCycle.init(context);
      }
      return true;
    });

    const [toolExtensions, clipExtensions] = useFilterExtensions(enableExtensions);

    const header = useMemo(() => {
      return (
        <Header
          pathname={pathname}
          service={currentService}
          currentRepository={currentRepository}
        />
      );
    }, [pathname, currentService, currentRepository]);

    const overlay = useMemo(() => {
      return (
        <Menu onClick={e => dispatch(asyncChangeAccount.started({ id: e.key }))}>
          {props.accounts.map(o => (
            <Menu.Item key={o.id} title={o.name}>
              <UserItem
                avatar={o.avatar}
                name={o.name}
                description={o.description}
                icon={servicesMeta[o.type].icon}
              />
            </Menu.Item>
          ))}
        </Menu>
      );
    }, [dispatch, props.accounts, servicesMeta]);

    const dropdown = (
      <Dropdown overlay={overlay} placement="bottomRight">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!!currentAccount && (
            <IconAvatar
              size="small"
              avatar={currentAccount.avatar}
              icon={servicesMeta[currentAccount.type].icon}
            />
          )}
          <IconFont
            type="caret-down"
            style={{ fontSize: 8, color: 'rgb(140, 140, 140)', marginLeft: 6 }}
          />
        </div>
      </Dropdown>
    );

    return (
      <ToolContainer onClickCloseButton={Container.get(IContentScriptService).hide}>
        {header}
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
        <Section className={styles.section} title={<FormattedMessage id="tool.repository" />}>
          <RepositorySelect
            disabled={loadingAccount}
            loading={loadingAccount}
            repositories={repositories}
            onSelect={onRepositorySelect}
            style={{ width: '100%' }}
            dropdownMatchSelectWidth={true}
            value={repositoryId}
          />
        </Section>
        <Section>
          <div className={styles.toolbar}>
            <Button
              className={styles.toolbarButton}
              onClick={() => {
                if (pathname.startsWith('/preference')) {
                  push('/');
                } else {
                  push('/preference/account');
                }
              }}
            >
              <Observer>
                {() => (
                  <Badge dot={!configService.isLatestVersion}>
                    <Icon type="setting" style={{ fontSize: 18 }} />
                  </Badge>
                )}
              </Observer>
            </Button>
            {dropdown}
          </div>
        </Section>
      </ToolContainer>
    );
  },
  (prevProps: PageProps, nextProps: PageProps) => {
    const selector = ({
      repositories,
      currentAccount,
      currentRepository,
      history,
      loadingAccount,
      locale,
      servicesMeta,
      accounts,
    }: PageProps) => {
      return {
        loadingAccount,
        currentRepository,
        repositories,
        currentAccount,
        pathname: history.location.pathname,
        locale,
        servicesMeta,
        accounts,
      };
    };
    return isEqual(selector(prevProps), selector(nextProps));
  }
);

export default connect(mapStateToProps)(Page as React.FC<PageProps>);
