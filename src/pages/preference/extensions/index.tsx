import React, { useState } from 'react';
import { connect } from 'dva';
import { DvaRouterProps } from '@/common/types';
import { Tabs } from 'antd';
import Locale from './locale';
import Remote from './remote';
import config from '@/config';

const Page: React.FC<DvaRouterProps> = () => {
  const [activeKey, setActiveKey] = useState('Local');

  return (
    <Tabs activeKey={activeKey} onChange={setActiveKey}>
      <Tabs.TabPane tab="Local" key="Local">
        <Locale></Locale>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Remote" key="Remote">
        <Remote host={config.remoteExtensionHost}></Remote>
      </Tabs.TabPane>
    </Tabs>
  );
};

export default connect()(Page);
