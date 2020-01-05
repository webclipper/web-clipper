import React, { useEffect } from 'react';
import { useSelector } from 'dva';
import { parse } from 'qs';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import { Spin } from 'antd';
import styles from './login.scss';
import Container from 'typedi';
import { ITabService } from '@/service/common/tab';
import { IPowerpackService } from '@/service/common/powerpack';

interface PageQuery {
  token: string;
}

const Page: React.FC<DvaRouterProps> = () => {
  const g = useSelector((g: GlobalStore) => g);

  useEffect(() => {
    if (g.router) {
      const query = parse(g.router.location.search.slice(1)) as PageQuery;
      (async () => {
        const powerpackService = Container.get(IPowerpackService);
        const tabService = Container.get(ITabService);
        await powerpackService.login(query.token);
        await tabService.closeCurrent();
      })();
    }
  }, [g.router]);

  return (
    <div className={styles.container}>
      <Spin size="large" />
    </div>
  );
};

export default Page;
