import { IPowerpackService } from '@/service/common/powerpack';
import { Container } from 'typedi';
import { useObserver } from 'mobx-react';
import { useCallback } from 'react';
import { routerRedux, useDispatch } from 'dva';

function usePowerpack() {
  const powerpackService = Container.get(IPowerpackService);

  const { userInfo, bought, expired } = useObserver(() => {
    return {
      userInfo: powerpackService.userInfo,
      bought: powerpackService.bought,
      expired: powerpackService.expired,
    };
  });

  const dispatch = useDispatch();
  const boughtPowerpack = useCallback(() => {
    dispatch(routerRedux.push('/preference/powerpack'));
  }, [dispatch]);

  return {
    boughtPowerpack,
    userInfo,
    bought,
    expired,
    valid: bought && !expired,
  };
}
export default usePowerpack;
