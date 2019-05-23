import SagaHelper from 'common/sagaHelper';
import browserService from 'common/browser';
import storage from 'common/storage';
import update from 'immutability-helper';
import { call, put, select } from 'redux-saga/effects';
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
import { hideTool, runScript, removeTool } from 'browserActions/message';

export const userPreferenceSagas = new SagaHelper()
  .takeEvery(asyncVerificationAccessToken, function*(action) {
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
  })
  .takeEvery(asyncAddAccount, function*(action) {
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
  })
  .takeEvery(asyncUpdateAccount, function*(action) {
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
  })
  .takeEvery(asyncDeleteAccount, function*(action) {
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
  })
  .takeEvery(asyncUpdateCurrentAccountIndex, function*(action) {
    yield call(storage.setDefaultAccountId, action.payload.id);
    yield put(
      asyncUpdateCurrentAccountIndex.done({
        params: action.payload,
        result: action.payload,
      })
    );
  })
  .takeEvery(asyncSetShowLineNumber, function*(action) {
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
  })
  .takeEvery(asyncSetEditorLiveRendering, function*(action) {
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
  })
  .takeEvery(asyncHideTool, function*() {
    yield call(browserService.sendActionToCurrentTab, hideTool());
  })
  .takeEvery(asyncRemoveTool, function*() {
    yield call(browserService.sendActionToCurrentTab, removeTool());
  })
  .takeEvery(asyncSetDefaultPluginId, function*(action) {
    yield call(storage.setDefaultPluginId, action.payload.pluginId);
    yield put(
      asyncSetDefaultPluginId.done({
        params: action.payload,
      })
    );
  })
  .takeEvery(asyncEditImageHosting, function*(action) {
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
  })
  .takeEvery(asyncDeleteImageHosting, function*(action) {
    const imageHostingList: PromiseType<
      ReturnType<typeof storage.deleteImageHostingById>
    > = yield call(storage.deleteImageHostingById, action.payload.id);
    yield put(
      asyncDeleteImageHosting.done({
        params: action.payload,
        result: imageHostingList,
      })
    );
  })
  .takeEvery(asyncAddImageHosting, function*(action) {
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
  })
  .takeEvery(asyncRunExtension, function*(action) {
    const { extension } = action.payload;
    let result;
    const { run, afterRun, destroy } = extension;
    if (run) {
      result = yield call(
        browserService.sendActionToCurrentTab,
        runScript(run)
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
      yield call(browserService.sendActionToCurrentTab, runScript(destroy));
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
  })
  .combine();
