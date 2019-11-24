import update from 'immutability-helper';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import { GlobalStore, AccountPreference } from '@/common/types';
import { syncStorageService } from '@/common/chrome/storage';
import {
  initAccounts,
  asyncAddAccount,
  asyncDeleteAccount,
  asyncUpdateCurrentAccountId,
  asyncUpdateAccount,
} from '@/actions/account';
import { asyncChangeAccount } from '@/actions/clipper';
import { message } from 'antd';

const initState: GlobalStore['account'] = {
  accounts: [],
};

const model = new DvaModelBuilder(initState, 'account');

model
  .subscript(async function loadAccounts({ dispatch }) {
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
  .takeEvery(initAccounts.started, function*(_, { call, put }) {
    let accountsString = yield call(syncStorageService.get, 'accounts', '[]');
    const defaultAccountId: string = yield call(syncStorageService.get, 'defaultAccountId');
    if (typeof accountsString !== 'string') {
      accountsString = JSON.stringify(accountsString);
    }
    const accounts = <AccountPreference[]>JSON.parse(accountsString);
    yield put(initAccounts.done({ result: { accounts, defaultAccountId } }));
  })
  .case(initAccounts.done, (s, { result: { accounts, defaultAccountId } }) => ({
    ...s,
    accounts,
    defaultAccountId,
  }));

model.takeEvery(asyncAddAccount.started, function*(payload, { select, call }) {
  const selector = ({ account: { accounts } }: GlobalStore) => {
    return { accounts };
  };
  const { accounts }: ReturnType<typeof selector> = yield select(selector);
  const { info, imageHosting, defaultRepositoryId, type, userInfo, callback, id } = payload;
  const userPreference: AccountPreference = {
    ...userInfo,
    ...info,
    imageHosting,
    defaultRepositoryId,
    type,
    id,
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

model.takeEvery(asyncUpdateAccount, function*(payload, { select, put, call }) {
  const selector = ({ account: { accounts }, userPreference: { servicesMeta } }: GlobalStore) => ({
    accounts,
    servicesMeta,
  });
  const { accounts }: ReturnType<typeof selector> = yield select(selector);
  const {
    id,
    account: { info, defaultRepositoryId, imageHosting },
    userInfo,
    newId,
    callback,
  } = payload;
  const accountIndex = accounts.findIndex(o => o.id === id);
  if (accountIndex < 0) {
    message.error('Account Not Exist');
    callback();
    return;
  }
  const result = update(accounts, {
    [accountIndex]: {
      $merge: {
        id: newId,
        defaultRepositoryId,
        imageHosting,
        ...userInfo,
        ...info,
      },
    },
  });
  yield call(syncStorageService.set, 'accounts', JSON.stringify(result));
  const currentAccountId: string = yield select((g: GlobalStore) => g.clipper.currentAccountId);
  if (id === currentAccountId) {
    yield put(asyncChangeAccount.started({ id }));
  }
  callback();
});

export default model.build();
