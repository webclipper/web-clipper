import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { parse } from 'qs';
import { DvaRouterProps, GlobalStore } from '@/common/types';
import { loginWithToken } from '@/actions/userPreference';

interface PageQuery {
  token: string;
}

const Page: React.FC<DvaRouterProps> = () => {
  const g = useSelector((g: GlobalStore) => g);
  const dispatch = useDispatch();

  useEffect(() => {
    if (g.router) {
      const query = parse(g.router.location.search.slice(1)) as PageQuery;
      dispatch(loginWithToken(query.token));
    }
  }, [dispatch, g.router]);

  return <div></div>;
};

export default Page;
