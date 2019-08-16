import * as React from 'react';
import * as styles from './index.scss';
import Account from './account';
import ImageHosting from './imageHosting';
import Extensions from './extensions';
import { CenterContainer } from 'components/container';
import { router, connect } from 'dva';
import { Tabs, Icon } from 'antd';
import { FormattedMessage } from 'react-intl';
import Base from './base';
import { DvaRouterProps } from '@/common/types';

const { Route } = router;

const TabPane = Tabs.TabPane;

const tabs = [
  {
    path: 'account',
    title: <FormattedMessage id="preference.tab.account" defaultMessage="Account" />,
    component: Account,
  },
  {
    path: 'extensions',
    title: <FormattedMessage id="preference.tab.extensions" defaultMessage="Extension" />,
    component: Extensions,
  },
  {
    path: 'imageHost',
    title: <FormattedMessage id="preference.tab.imageHost" defaultMessage="ImageHost" />,
    component: ImageHosting,
  },
  {
    path: 'base',
    title: <FormattedMessage id="preference.tab.basic" defaultMessage="Basic"></FormattedMessage>,
    component: Base,
  },
];

const Preference: React.FC<DvaRouterProps> = ({ location: { pathname }, history: { push } }) => {
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
              return (
                <TabPane tab={tab.title} key={path} className={styles.tabPane}>
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

export default connect()(Preference);
