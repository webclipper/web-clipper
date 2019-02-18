import browserService from '../../services/browser';
import storage from '../../services/common/store';
import { AnyAction, isType } from 'typescript-fsa';
import {
  asyncAddAccount,
  asyncDeleteAccount,
  asyncHideTool,
  asyncRemoveTool,
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber,
  asyncSetShowQuickResponseCode,
  asyncUpdateCurrentAccountIndex,
  asyncVerificationAccessToken,
  updateCreateAccountForm
} from './../actions/userPreference';
import {
  call,
  cancelled,
  fork,
  put,
  race,
  select,
  take,
  takeEvery
} from 'redux-saga/effects';
import { documentServiceFactory } from '../../services/backend';
import { message } from 'antd';
import md5 = require('blueimp-md5');

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
    id: md5(accessToken.value),
    type: type.value,
    accessToken: accessToken.value,
    host: host.value,
    defaultRepositoryId: defaultRepositoryId ? defaultRepositoryId.value : '',
    ...userInfo
  };
  try {
    yield call(storage.addAccount, account);
  } catch (error) {
    if (error.message === 'Do not allow duplicate accounts') {
      message.error('不允许添加重复账户');
      return;
    } else {
      message.error('添加账户失败 未知错误');
      return;
    }
  }
  const accounts = yield call(storage.getAccounts);
  const defaultAccountId = yield call(storage.getDefaultAccountId);

  yield put(
    asyncAddAccount.done({
      result: { accounts, defaultAccountId }
    })
  );
}

export function* watchAsyncAddAccountSaga() {
  yield takeEvery(asyncAddAccount.started.type, asyncAddAccountSaga);
}

export function* asyncDeleteAccountSaga(action: AnyAction) {
  if (isType(action, asyncDeleteAccount.started)) {
    yield call(storage.deleteAccountById, action.payload.id);
    const accounts = yield call(storage.getAccounts);
    const defaultAccountId = yield call(storage.getDefaultAccountId);
    yield put(
      asyncDeleteAccount.done({
        params: action.payload,
        result: {
          accounts: accounts,
          defaultAccountId: defaultAccountId
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
    yield call(storage.setDefaultAccountId, action.payload.id);
    yield put(
      asyncUpdateCurrentAccountIndex.done({
        params: action.payload,
        result: action.payload
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

export function* asyncSetShowLineNumberSaga(action: AnyAction) {
  if (isType(action, asyncSetShowLineNumber.started)) {
    const value = action.payload.value;
    yield call(storage.setShowLineNumber, !value);
    yield put(
      asyncSetShowLineNumber.done({
        params: {
          value
        },
        result: {
          value: !value
        }
      })
    );
  }
}

export function* watchAsyncSetShowLineNumberSaga() {
  yield takeEvery(
    asyncSetShowLineNumber.started.type,
    asyncSetShowLineNumberSaga
  );
}

export function* asyncSetEditorLiveRenderingSaga(action: AnyAction) {
  if (isType(action, asyncSetEditorLiveRendering.started)) {
    const value = action.payload.value;
    yield call(storage.setLiveRendering, !value);
    yield put(
      asyncSetEditorLiveRendering.done({
        params: {
          value
        },
        result: {
          value: !value
        }
      })
    );
  }
}

export function* asyncSetShowQuickResponseCodeSaga(action: AnyAction) {
  if (isType(action, asyncSetShowQuickResponseCode.started)) {
    const value = action.payload.value;
    yield call(storage.setShowQuickResponseCode, !value);
    yield put(
      asyncSetShowQuickResponseCode.done({
        params: {
          value
        },
        result: {
          value: !value
        }
      })
    );
  }
}

export function* watchAsyncSetShowQuickResponseCodeSaga() {
  yield takeEvery(
    asyncSetShowQuickResponseCode.started.type,
    asyncSetShowQuickResponseCodeSaga
  );
}

export function* watchAsyncSetEditorLiveRenderingSaga() {
  yield takeEvery(
    asyncSetEditorLiveRendering.started.type,
    asyncSetEditorLiveRenderingSaga
  );
}

export function* asyncHideToolSaga(action: AnyAction) {
  if (isType(action, asyncHideTool.started)) {
    yield call(browserService.sendActionToCurrentTab, action);
  }
}

export function* watchAsyncHideToolSaga() {
  yield takeEvery(asyncHideTool.started.type, asyncHideToolSaga);
}

export function* asyncRemoveToolSaga(action: AnyAction) {
  if (isType(action, asyncRemoveTool.started)) {
    yield call(browserService.sendActionToCurrentTab, action);
  }
}

export function* watchAsyncRemoveToolSaga() {
  yield takeEvery(asyncRemoveTool.started.type, asyncRemoveToolSaga);
}

export function* userPreferenceSagas() {
  yield fork(watchAsyncDeleteAccountSaga);
  yield fork(watchAsyncVerificationAccessTokenSaga);
  yield fork(watchAsyncAddAccountSaga);
  yield fork(watchAsyncUpdateCurrentAccountIndexSaga);
  yield fork(watchAsyncSetEditorLiveRenderingSaga);
  yield fork(watchAsyncSetShowLineNumberSaga);
  yield fork(watchAsyncHideToolSaga);
  yield fork(watchAsyncRemoveToolSaga);
  yield fork(watchAsyncSetShowQuickResponseCodeSaga);
}
