import * as React from 'react';
import * as styles from './index.scss';
import Account from './account';
import ImageHosting from './imageHosting';
import Extensions from './extensions';
import { CenterContainer } from 'components/container';
import { router, connect } from 'dva';
import { Tabs, Icon, Badge } from 'antd';
import { FormattedMessage } from 'react-intl';
import Base from './base';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import Changelog from './changelog';

const { Route } = router;

const TabPane = Tabs.TabPane;

const mapStateToProps = ({ version: { hasUpdate } }: GlobalStore) => {
  return {
    hasUpdate,
  };
};
type PageStateProps = ReturnType<typeof mapStateToProps>;

const tabs = [
  {
    path: 'account',
    title: (
      <React.Fragment>
        <Icon type="user"></Icon>
        <FormattedMessage id="preference.tab.account" defaultMessage="Account" />
      </React.Fragment>
    ),
    component: Account,
  },
  {
    path: 'extensions',
    title: (
      <React.Fragment>
        <Icon type="tool" />
        <FormattedMessage id="preference.tab.extensions" defaultMessage="Extension" />
      </React.Fragment>
    ),
    component: Extensions,
  },
  {
    path: 'imageHost',
    title: (
      <React.Fragment>
        <Icon type="picture" />
        <FormattedMessage id="preference.tab.imageHost" defaultMessage="ImageHost" />
      </React.Fragment>
    ),
    component: ImageHosting,
  },
  {
    path: 'base',
    title: (
      <React.Fragment>
        <Icon type="setting" />
        <FormattedMessage id="preference.tab.basic" defaultMessage="Basic" />
      </React.Fragment>
    ),
    component: Base,
  },
  {
    path: 'changelog',
    title: (
      <React.Fragment>
        <Icon type="sound" />
        <FormattedMessage id="preference.tab.changelog" defaultMessage="Changelog" />
      </React.Fragment>
    ),
    component: Changelog,
  },
];

type PageProps = DvaRouterProps & PageStateProps;

const Preference: React.FC<PageProps> = ({
  location: { pathname },
  history: { push },
  hasUpdate,
}) => {
  const goHome = () => push('/');

  return (
    <CenterContainer>
      <div className={styles.mainContent}>
        <div onClick={goHome} className={styles.closeIcon}>
          <Icon type="close" />
        </div>
        <div style={{ background: 'white', height: '100%' }}>
          <Tabs activeKey={pathname} tabPosition="left" style={{ height: '100%' }} onChange={push}>
            {tabs.map(tab => {
              const path = `/preference/${tab.path}`;
              let tabTitle = tab.title;
              if (hasUpdate && tab.path === 'base') {
                tabTitle = <Badge dot>{tabTitle}</Badge>;
              }
              return (
                <TabPane tab={tabTitle} key={path} className={styles.tabPane}>
                  <Route exact path={path} component={tab.component} />
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      </div>
    </CenterContainer>
  );
};

export default connect(mapStateToProps)(Preference);
