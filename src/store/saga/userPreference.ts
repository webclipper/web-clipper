import browserService from 'common/browser';
import storage from 'common/storage';
import update from 'immutability-helper';
import { AnyAction, isType } from 'common/typescript-fsa';
import { call, fork, put, select, takeEvery } from 'redux-saga/effects';
import { GlobalStore } from './../reducers/interface';
import { loadImage } from 'common/blob';
import { message } from 'antd';
import { ServiceMeta } from 'common/backend/services/interface';
import { ToolContext } from '../../extensions/interface';
import {
  asyncAddAccount,
  asyncDeleteAccount,
  asyncHideTool,
  asyncRemoveTool,
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber,
  asyncUpdateCurrentAccountIndex,
  asyncVerificationAccessToken,
  asyncSetDefaultPluginId,
  asyncRunExtension,
  asyncRunScript,
  asyncAddImageHosting,
  asyncDeleteImageHosting,
  asyncEditImageHosting,
  resetAccountForm,
  asyncUpdateAccount,
  asyncChangeAccount,
} from 'actions';
import backend, {
  documentServiceFactory,
  imageHostingServiceFactory,
} from 'common/backend';

export function* asyncVerificationAccessTokenSaga(action: AnyAction) {
  if (isType(action, asyncVerificationAccessToken.started)) {
    try {
      const { type, info } = action.payload;
      const service = documentServiceFactory(type, info);
      const userInfo = yield call(service.getUserInfo);
      const repositories = yield call(service.getRepositories);
      yield put(
        asyncVerificationAccessToken.done({
          params: action.payload,
          result: {
            repositories,
            userInfo,
          },
        })
      );
    } catch (error) {
      message.error(error.message);
      yield put(resetAccountForm());
    }
  }
}

export function* watchAsyncVerificationAccessTokenSaga() {
  yield takeEvery(
    asyncVerificationAccessToken.started.type,
    asyncVerificationAccessTokenSaga
  );
}

export function* asyncAddAccountSaga(action: AnyAction) {
  if (isType(action, asyncAddAccount.started)) {
    const selector = ({
      userPreference: {
        servicesMeta,
        initializeForm: { userInfo },
      },
    }: GlobalStore) => {
      return { userInfo, servicesMeta };
    };
    const {
      servicesMeta,
      userInfo,
    }: ReturnType<typeof selector> = yield select(selector);
    const {
      info,
      imageHosting,
      defaultRepositoryId,
      type,
      callback,
    } = action.payload;
    const service: ServiceMeta = servicesMeta[type];
    const { service: Service } = service;
    const instance = new Service(info);

    const userPreference = {
      type,
      id: instance.getId(),
      ...userInfo,
      imageHosting,
      defaultRepositoryId,
      ...info,
    };
    try {
      yield storage.addAccount(userPreference);
      const accounts = yield storage.getAccounts();
      const defaultAccountId = yield storage.getDefaultAccountId();
      yield put(
        asyncAddAccount.done({
          params: action.payload,
          result: {
            accounts,
            defaultAccountId,
          },
        })
      );
      callback();
      yield put(resetAccountForm());
    } catch (error) {
      message.error(error.message);
    }
  }
}

export function* watchAsyncAddAccountSaga() {
  yield takeEvery(asyncAddAccount.started.type, asyncAddAccountSaga);
}

export function* asyncUpdateAccountSaga(action: AnyAction) {
  if (isType(action, asyncUpdateAccount.started)) {
    const accounts: CallResult<typeof storage.getAccounts> = yield call(
      storage.getAccounts
    );
    const {
      id,
      account: { info, defaultRepositoryId, imageHosting },
      callback,
    } = action.payload;
    const accountIndex = accounts.findIndex(o => o.id === id);
    if (accountIndex < 0) {
      message.error('修改失败，账户不存在');
      return;
    }
    const result = update(accounts, {
      [accountIndex]: {
        $merge: {
          defaultRepositoryId,
          imageHosting,
          ...info,
        },
      },
    });
    yield storage.setAccount(result);
    yield put(
      asyncUpdateAccount.done({
        params: action.payload,
        result: {
          accounts: result,
        },
      })
    );
    const selector = ({ clipper: { currentAccountId } }: GlobalStore) => {
      return { currentAccountId };
    };
    const { currentAccountId }: ReturnType<typeof selector> = yield select(
      selector
    );
    if (id === currentAccountId) {
      yield put(asyncChangeAccount.started({ id }));
    }
    callback();
  }
}

export function* watchAsyncUpdateAccountSaga() {
  yield takeEvery(asyncUpdateAccount.started.type, asyncUpdateAccountSaga);
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
          defaultAccountId: defaultAccountId,
        },
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
        result: action.payload,
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
          value,
        },
        result: {
          value: !value,
        },
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
          value,
        },
        result: {
          value: !value,
        },
      })
    );
  }
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

export function* asyncSetDefaultPluginIdSaga(action: AnyAction) {
  if (isType(action, asyncSetDefaultPluginId.started)) {
    yield call(storage.setDefaultPluginId, action.payload.pluginId);
    yield put(
      asyncSetDefaultPluginId.done({
        params: action.payload,
      })
    );
  }
}

export function* watchAsyncSetDefaultPluginIdSaga() {
  yield takeEvery(
    asyncSetDefaultPluginId.started.type,
    asyncSetDefaultPluginIdSaga
  );
}

export function* asyncRunExtensionSaga(action: AnyAction) {
  if (isType(action, asyncRunExtension.started)) {
    const { extension } = action.payload;
    let result;
    const { run, afterRun, destroy } = extension;
    if (run) {
      result = yield call(
        browserService.sendActionToCurrentTab,
        asyncRunScript.started(run)
      );
    }
    const selector = (state: GlobalStore) => {
      const pathname = state.router.location.pathname;
      const data = state.clipper.clipperData[pathname];
      return {
        data,
        pathname,
      };
    };
    const { data, pathname }: ReturnType<typeof selector> = yield select(
      selector
    );
    if (afterRun) {
      result = yield (async () => {
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const context: ToolContext = {
          result,
          data,
          message,
          imageService: backend.getImageHostingService(),
          loadImage: loadImage,
          captureVisibleTab: browserService.captureVisibleTab,
        };
        // eslint-disable-next-line
        return await eval(afterRun);
      })();
    }
    if (destroy) {
      yield call(
        browserService.sendActionToCurrentTab,
        asyncRunScript.started(destroy)
      );
    }
    yield put(
      asyncRunExtension.done({
        params: action.payload,
        result: {
          result,
          pathname,
        },
      })
    );
  }
}

export function* watchAsyncRunExtensionSaga() {
  yield takeEvery(asyncRunExtension.started.type, asyncRunExtensionSaga);
}

export function* watchAsyncAddImageHostingSaga() {
  yield takeEvery(asyncAddImageHosting.started.type, asyncAddImageHostingSaga);
}

export function* asyncAddImageHostingSaga(action: AnyAction) {
  if (isType(action, asyncAddImageHosting.started)) {
    const { info, type, closeModal, remark } = action.payload;
    const imageHostingService: ReturnType<
      typeof imageHostingServiceFactory
    > = yield call(imageHostingServiceFactory, type, info);
    if (!imageHostingService) {
      message.error('不支持');
      return;
    }
    const id = imageHostingService.getId();
    const imageHosting = {
      id,
      type,
      info,
      remark,
    };
    try {
      const imageHostingList: PromiseType<
        ReturnType<typeof storage.addImageHosting>
      > = yield call(storage.addImageHosting, imageHosting);
      yield put(
        asyncAddImageHosting.done({
          params: action.payload,
          result: imageHostingList,
        })
      );
      closeModal();
    } catch (error) {
      message.error(error.message);
    }
  }
}

export function* watchAsyncDeleteImageHostingSaga() {
  yield takeEvery(
    asyncDeleteImageHosting.started.type,
    asyncDeleteImageHostingSaga
  );
}

export function* asyncDeleteImageHostingSaga(action: AnyAction) {
  if (isType(action, asyncDeleteImageHosting.started)) {
    const imageHostingList: PromiseType<
      ReturnType<typeof storage.deleteImageHostingById>
    > = yield call(storage.deleteImageHostingById, action.payload.id);
    yield put(
      asyncDeleteImageHosting.done({
        params: action.payload,
        result: imageHostingList,
      })
    );
  }
}

export function* watchAsyncEditImageHostingSaga() {
  yield takeEvery(
    asyncEditImageHosting.started.type,
    asyncEditImageHostingSaga
  );
}

export function* asyncEditImageHostingSaga(action: AnyAction) {
  if (isType(action, asyncEditImageHosting.started)) {
    const { id, value, closeModal } = action.payload;
    try {
      const imageHostingList: PromiseType<
        ReturnType<typeof storage.editImageHostingById>
      > = yield call(storage.editImageHostingById, id, { ...value, id });
      yield put(
        asyncEditImageHosting.done({
          params: action.payload,
          result: imageHostingList,
        })
      );
      closeModal();
    } catch (error) {
      message.error(error.message);
    }
  }
}

export function* userPreferenceSagas() {
  yield fork(watchAsyncDeleteAccountSaga);
  yield fork(watchAsyncVerificationAccessTokenSaga);
  yield fork(watchAsyncAddImageHostingSaga);
  yield fork(watchAsyncAddAccountSaga);
  yield fork(watchAsyncUpdateCurrentAccountIndexSaga);
  yield fork(watchAsyncSetEditorLiveRenderingSaga);
  yield fork(watchAsyncSetShowLineNumberSaga);
  yield fork(watchAsyncHideToolSaga);
  yield fork(watchAsyncRemoveToolSaga);
  yield fork(watchAsyncSetDefaultPluginIdSaga);
  yield fork(watchAsyncRunExtensionSaga);
  yield fork(watchAsyncDeleteImageHostingSaga);
  yield fork(watchAsyncEditImageHostingSaga);
  yield fork(watchAsyncUpdateAccountSaga);
}
