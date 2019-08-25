import update from 'immutability-helper';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import { GlobalStore, AccountPreference } from '@/common/types';
import { syncStorageService } from '@/common/chrome/storage';
import {
  initAccounts,
  asyncAddAccount,
  asyncDeleteAccount,
  asyncUpdateCurrentAccountId,
} from '@/actions/account';
import { routerRedux } from 'dva';
import { asyncChangeAccount } from '@/actions/clipper';
import { ServiceMeta } from '@/common/backend';
import { message } from 'antd';

const initState: GlobalStore['account'] = {
  accounts: [],
};

const model = new DvaModelBuilder(initState, 'account');

model
  .subscript(async function loadAccounts({ dispatch }) {
    dispatch(removeActionNamespace(initAccounts.started()));
    syncStorageService.onDidChangeStorage(key => {
      if (key === 'accounts') {
        dispatch(removeActionNamespace(initAccounts.started()));
      }
      if (key === 'defaultAccountId') {
        const defaultAccountId = syncStorageService.get('defaultAccountId');
        dispatch(
          removeActionNamespace(asyncUpdateCurrentAccountId.started({ id: defaultAccountId }))
        );
      }
    });
  })
  .takeEvery(initAccounts.started, function*(_, { call, put, select }) {
    let accountsString = yield call(syncStorageService.get, 'accounts', '[]');
    const defaultAccountId: string = yield call(syncStorageService.get, 'defaultAccountId');
    if (typeof accountsString !== 'string') {
      accountsString = JSON.stringify(accountsString);
    }
    const accounts = <AccountPreference[]>JSON.parse(accountsString);
    yield put(initAccounts.done({ result: { accounts, defaultAccountId } }));
    const currentAccountId: string | undefined = yield select(
      (g: GlobalStore) => g.account.currentAccountId
    );
    if (accounts.length === 0) {
      yield put(routerRedux.push('/preference/account'));
      return;
    }
    if (currentAccountId) {
      return;
    }
    if (defaultAccountId) {
      yield put(asyncChangeAccount.started({ id: defaultAccountId }));
    }
  })
  .case(initAccounts.done, (s, { result: { accounts, defaultAccountId } }) => ({
    ...s,
    accounts,
    defaultAccountId,
  }));

model.takeEvery(asyncAddAccount.started, function*(payload, { select, call }) {
  const selector = ({ userPreference: { servicesMeta }, account: { accounts } }: GlobalStore) => {
    return { servicesMeta, accounts };
  };
  const { servicesMeta, accounts }: ReturnType<typeof selector> = yield select(selector);
  const { info, imageHosting, defaultRepositoryId, type, userInfo, callback } = payload;
  const service: ServiceMeta = servicesMeta[type];
  const { service: Service } = service;
  const instance = new Service(info);
  const userPreference: AccountPreference = {
    type,
    id: instance.getId(),
    ...userInfo,
    imageHosting,
    defaultRepositoryId,
    ...info,
  };
  if (accounts.some(o => o.id === userPreference.id)) {
    message.error('Do not allow duplicate accounts');
    return;
  }
  const newAccounts = update(accounts, {
    $push: [userPreference],
  });
  if (newAccounts.length === 1) {
    yield call(syncStorageService.set, 'defaultAccountId', userPreference.id);
  }
  callback();
  yield call(syncStorageService.set, 'accounts', JSON.stringify(newAccounts));
});

model.takeEvery(asyncDeleteAccount.started, function*({ id }, { select, call }) {
  const accounts: AccountPreference[] = yield select((g: GlobalStore) => g.account.accounts);
  const defaultAccountId: string = yield select((g: GlobalStore) => g.account.defaultAccountId);
  const newAccounts = accounts.filter(o => o.id !== id);
  if (defaultAccountId === id) {
    if (newAccounts.length > 0) {
      yield call(syncStorageService.set, 'defaultAccountId', newAccounts[0].id);
    } else {
      yield call(syncStorageService.delete, 'defaultAccountId');
    }
  }
  yield call(syncStorageService.set, 'accounts', JSON.stringify(newAccounts));
});

model
  .takeEvery(asyncUpdateCurrentAccountId.started, function*({ id }, { call, put }) {
    yield call(syncStorageService.set, 'defaultAccountId', id);
    yield put(asyncUpdateCurrentAccountId.done({ params: { id } }));
  })
  .case(asyncUpdateCurrentAccountId.done, (s, { params: { id: defaultAccountId } }) => ({
    ...s,
    defaultAccountId,
  }));

export default model.build();
