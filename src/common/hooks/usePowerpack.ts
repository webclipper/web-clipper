import { useCallback } from 'react';
import { checkBill } from '@/common/powerpack';
import { useSelector, routerRedux, useDispatch } from 'dva';
import { GlobalStore } from '@/common/types';
import { isEqual } from 'lodash';

function usePowerpack() {
  const { userInfo, bought, expired } = useSelector((g: GlobalStore) => {
    const userInfo = g.userPreference.userInfo;
    let bought = !!userInfo;
    const expired = bought && !checkBill(userInfo!.expire_date);
    return {
      userInfo,
      bought,
      expired,
    };
  }, isEqual);

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
