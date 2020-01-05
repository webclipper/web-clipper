import React, { useEffect } from 'react';
import { parse } from 'qs';
import { DvaRouterProps } from '@/common/types';
import Container from 'typedi';
import { ITabService } from '@/service/common/tab';
import { IPowerpackService } from '@/service/common/powerpack';
import { useHistory } from 'dva';

interface PageQuery {
  token: string;
}

const Page: React.FC<DvaRouterProps> = () => {
  const history = useHistory();

  useEffect(() => {
    if (history?.location?.search) {
      const query = parse(history.location.search.slice(1)) as PageQuery;
      (async () => {
        const powerpackService = Container.get(IPowerpackService);
        const tabService = Container.get(ITabService);
        await powerpackService.login(query.token);
        await tabService.closeCurrent();
      })();
    }
  }, [history]);

  return <div></div>;
};

export default Page;
