import {
  asyncVerificationAccessToken,
  updateCreateAccountForm,
  asyncAddAccount,
  asyncDeleteAccount,
  asyncUpdateCurrentAccountIndex
} from './../actions/userPreference';
import {
  takeEvery,
  fork,
  select,
  call,
  put,
  race,
  take,
  cancelled
} from 'redux-saga/effects';
import { message } from 'antd';
import { documentServiceFactory } from '../../services/backend';
import storage from '../../services/common/store';
import { isType, AnyAction } from 'typescript-fsa';

export function* asyncVerificationAccessTokenSaga() {
  try {
    const selector = ({
      userPreference: {
        initializeForm: { accessToken, host, type }
      }
    }: GlobalStore) => {
      return {
        accessToken,
        host,
        type
      };
    };
    const selectState: ReturnType<typeof selector> = yield select(selector);
    const { accessToken, host, type } = selectState;
    if (!accessToken || !accessToken.value) {
      return;
    }
    if (!host || !host.value) {
      return;
    }
    const service = documentServiceFactory({
      type: type.value,
      accessToken: accessToken.value,
      baseURL: host.value
    });
    const userInfo = yield call(service.getUserInfo);
    const repositories = yield call(service.getRepositories);
    yield put(
      asyncVerificationAccessToken.done({
        result: {
          repositories,
          userInfo
        }
      })
    );
  } catch (error) {
    message.error('AccessToken 错误');
    yield put(
      asyncVerificationAccessToken.failed({
        error: {
          error: error
        }
      })
    );
  } finally {
    if (yield cancelled()) {
      yield put(
        asyncVerificationAccessToken.failed({
          error: {
            cancel: true
          }
        })
      );
    }
  }
}

export function* watchAsyncVerificationAccessTokenSaga() {
  yield takeEvery(asyncVerificationAccessToken.started.type, function* (
    ...args
  ) {
    yield race({
      task: call(asyncVerificationAccessTokenSaga, ...args),
      cancel: take(updateCreateAccountForm.type)
    });
  });
}

export function* asyncAddAccountSaga() {
  const selector = ({
    userPreference: {
      initializeForm: { accessToken, host, type, userInfo, defaultRepositoryId }
    }
  }: GlobalStore) => {
    return {
      accessToken,
      host,
      type,
      userInfo,
      defaultRepositoryId
    };
  };
  const selectState: ReturnType<typeof selector> = yield select(selector);
  let { accessToken, host, type, defaultRepositoryId, userInfo } = selectState;
  if (!accessToken || !accessToken.value) {
    return;
  }
  if (!host || !host.value) {
    return;
  }
  const account: AccountPreference = {
    type: type.value,
    accessToken: accessToken.value,
    host: host.value,
    defaultRepositoryId: defaultRepositoryId ? defaultRepositoryId.value : '',
    ...userInfo
  };
  yield call(storage.addAccount, account);
  const accounts = yield call(storage.getAccounts);

  yield put(
    asyncAddAccount.done({
      result: { accounts }
    })
  );
}

export function* watchAsyncAddAccountSaga() {
  yield takeEvery(asyncAddAccount.started.type, asyncAddAccountSaga);
}

export function* asyncDeleteAccountSaga(action: AnyAction) {
  if (isType(action, asyncDeleteAccount.started)) {
    yield call(storage.deleteAccountByAccessToken, action.payload.accessToken);
    const accounts = yield call(storage.getAccounts);
    yield put(
      asyncDeleteAccount.done({
        params: action.payload,
        result: {
          accounts: accounts
        }
      })
    );
  }
}

export function* watchAsyncDeleteAccountSaga() {
  yield takeEvery(asyncDeleteAccount.started.type, asyncDeleteAccountSaga);
}

export function* asyncUpdateCurrentAccountIndexSaga(action: AnyAction) {
  if (isType(action, asyncUpdateCurrentAccountIndex.started)) {
    console.log('-----------2');

    const accounts: AccountPreference[] = yield call(storage.getAccounts);
    const index = accounts.findIndex(
      o => o.accessToken === action.payload.accessToken
    );
    yield call(storage.setCurrentAccountIndex, index);
    console.log('-----------1');
    yield put(
      asyncUpdateCurrentAccountIndex.done({
        params: action.payload,
        result: {
          index: index
        }
      })
    );
  }
}

export function* watchAsyncUpdateCurrentAccountIndexSaga() {
  yield takeEvery(
    asyncUpdateCurrentAccountIndex.started.type,
    asyncUpdateCurrentAccountIndexSaga
  );
}

export function* userPreferenceSagas() {
  yield fork(watchAsyncDeleteAccountSaga);
  yield fork(watchAsyncVerificationAccessTokenSaga);
  yield fork(watchAsyncAddAccountSaga);
  yield fork(watchAsyncUpdateCurrentAccountIndexSaga);
}
