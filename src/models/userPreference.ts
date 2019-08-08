import { ServiceMeta } from './../common/backend/services/interface';
import { runScript } from './../browser/actions/message';
import storage from 'common/storage';
import { message } from 'antd';
import { GlobalStore } from '@/common/types';
import browserService from 'common/browser';
import { hideTool, removeTool } from 'browserActions/message';
import update from 'immutability-helper';
import {
  asyncAddAccount,
  asyncDeleteAccount,
  asyncSetEditorLiveRendering,
  asyncSetShowLineNumber,
  asyncUpdateCurrentAccountIndex,
  initUserPreference,
  asyncVerificationAccessToken,
  asyncDeleteImageHosting,
  asyncAddImageHosting,
  asyncEditImageHosting,
  resetAccountForm,
  asyncUpdateAccount,
  asyncHideTool,
  asyncRemoveTool,
  asyncRunExtension,
} from 'pageActions/userPreference';
import { asyncChangeAccount, initTabInfo, changeData } from 'pageActions/clipper';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import { UserPreferenceStore } from 'common/types';
import {
  services,
  imageHostingServices,
  documentServiceFactory,
  imageHostingServiceFactory,
} from 'common/backend';
import backend from 'common/backend/index';
import { loadImage } from 'common/blob';
import { routerRedux } from 'dva';

const servicesMeta = services.reduce(
  (previousValue, meta) => {
    previousValue[meta.type] = meta;
    return previousValue;
  },
  {} as UserPreferenceStore['servicesMeta']
);

const imageHostingServicesMeta = imageHostingServices.reduce(
  (previousValue, meta) => {
    previousValue[meta.type] = meta;
    return previousValue;
  },
  {} as UserPreferenceStore['imageHostingServicesMeta']
);

const defaultState: UserPreferenceStore = {
  accounts: [],
  imageHosting: [],
  servicesMeta,
  imageHostingServicesMeta,
  showLineNumber: true,
  liveRendering: true,
  initializeForm: {
    repositories: [],
    verified: false,
    verifying: false,
  },
};

const builder = new DvaModelBuilder(defaultState, 'userPreference')
  .case(asyncSetShowLineNumber.done, (state, { result: { value: showLineNumber } }) => ({
    ...state,
    showLineNumber,
  }))
  .case(asyncSetEditorLiveRendering.done, (state, { result: { value: liveRendering } }) => ({
    ...state,
    liveRendering,
  }))
  .case(asyncDeleteAccount.done, (state, { result: { accounts, defaultAccountId } }) => ({
    ...state,
    accounts,
    defaultAccountId,
  }))
  .case(initUserPreference, (state, payload) => ({
    ...state,
    ...payload,
  }))
  .case(asyncAddAccount.done, (state, { result: { accounts, defaultAccountId } }) => ({
    ...state,
    accounts,
    defaultAccountId,
  }))
  .case(asyncUpdateCurrentAccountIndex.done, (state, { result: { id: defaultAccountId } }) => ({
    ...state,
    defaultAccountId,
  }))
  .case(asyncDeleteImageHosting.done, (state, { result }) =>
    update(state, {
      imageHosting: {
        $set: result,
      },
    })
  )
  .case(asyncAddImageHosting.done, (state, { result }) =>
    update(state, {
      imageHosting: {
        $set: result,
      },
    })
  )
  .case(asyncEditImageHosting.done, (state, { result }) =>
    update(state, {
      imageHosting: {
        $set: result,
      },
    })
  )
  .case(asyncUpdateAccount.done, (state, { result: { accounts } }) =>
    update(state, {
      accounts: {
        $set: accounts,
      },
    })
  )
  .case(asyncVerificationAccessToken.done, (state, { result: { repositories, userInfo } }) =>
    update(state, {
      initializeForm: {
        $set: {
          verified: true,
          verifying: false,
          repositories,
          userInfo,
        },
      },
    })
  )
  .case(resetAccountForm, state =>
    update(state, {
      initializeForm: {
        $set: defaultState.initializeForm,
      },
    })
  );

builder
  .takeEvery(asyncVerificationAccessToken.started, function*({ type, info }, { call, put }) {
    try {
      const service = documentServiceFactory(type, info);
      const userInfo = yield call(service.getUserInfo);
      const repositories = yield call(service.getRepositories);
      yield put(
        asyncVerificationAccessToken.done({
          params: { type, info },
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
  .takeEvery(asyncAddAccount.started, function*(payload, { select, put }) {
    const selector = ({
      userPreference: {
        servicesMeta,
        initializeForm: { userInfo },
      },
    }: GlobalStore) => {
      return { userInfo, servicesMeta };
    };
    const { servicesMeta, userInfo }: ReturnType<typeof selector> = yield select(selector);
    const { info, imageHosting, defaultRepositoryId, type, callback } = payload;
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
          params: payload,
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
  .takeEvery(asyncUpdateAccount.started, function*(payload, { select, call, put }) {
    const accounts: CallResult<typeof storage.getAccounts> = yield call(storage.getAccounts);
    const {
      id,
      account: { info, defaultRepositoryId, imageHosting },
      callback,
    } = payload;
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
        params: payload,
        result: {
          accounts: result,
        },
      })
    );
    const selector = ({ clipper: { currentAccountId } }: GlobalStore) => {
      return { currentAccountId };
    };
    const { currentAccountId }: ReturnType<typeof selector> = yield select(selector);
    if (id === currentAccountId) {
      yield put(asyncChangeAccount.started({ id }));
    }
    callback();
  })
  .takeEvery(asyncDeleteAccount.started, function*(payload, { call, put }) {
    yield call(storage.deleteAccountById, payload.id);
    const accounts = yield call(storage.getAccounts);
    const defaultAccountId = yield call(storage.getDefaultAccountId);
    yield put(
      asyncDeleteAccount.done({
        params: payload,
        result: {
          accounts: accounts,
          defaultAccountId: defaultAccountId,
        },
      })
    );
  })
  .takeEvery(asyncUpdateCurrentAccountIndex.started, function*(payload, { call, put }) {
    yield call(storage.setDefaultAccountId, payload.id);
    yield put(
      asyncUpdateCurrentAccountIndex.done({
        params: payload,
        result: payload,
      })
    );
  })
  .takeEvery(asyncSetShowLineNumber.started, function*(payload, { call, put }) {
    const { value } = payload;
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
  .takeEveryWithAction(asyncSetEditorLiveRendering.started, function*(action, { call, put }) {
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
  .takeEvery(asyncHideTool.started, function*(_, { call }) {
    yield call(browserService.sendActionToCurrentTab, hideTool());
  })
  .takeEvery(asyncRemoveTool.started, function*(_, { call }) {
    yield call(browserService.sendActionToCurrentTab, removeTool());
  })
  .takeEvery(asyncEditImageHosting.started, function*(payload, { call, put }) {
    const { id, value, closeModal } = payload;
    try {
      const imageHostingList = yield call(storage.editImageHostingById, id, {
        ...value,
        id,
      });
      yield put(
        asyncEditImageHosting.done({
          params: payload,
          result: imageHostingList,
        })
      );
      closeModal();
    } catch (error) {
      message.error(error.message);
    }
  })
  .takeEvery(asyncDeleteImageHosting.started, function*(payload, { call, put }) {
    const imageHostingList: PromiseType<
      ReturnType<typeof storage.deleteImageHostingById>
    > = yield call(storage.deleteImageHostingById, payload.id);
    yield put(
      asyncDeleteImageHosting.done({
        params: payload,
        result: imageHostingList,
      })
    );
  })
  .takeEvery(asyncAddImageHosting.started, function*(payload, { call, put }) {
    const { info, type, closeModal, remark } = payload;
    const imageHostingService: ReturnType<typeof imageHostingServiceFactory> = yield call(
      imageHostingServiceFactory,
      type,
      info
    );
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
      const imageHostingList: PromiseType<ReturnType<typeof storage.addImageHosting>> = yield call(
        storage.addImageHosting,
        imageHosting
      );
      yield put(
        asyncAddImageHosting.done({
          params: payload,
          result: imageHostingList,
        })
      );
      closeModal();
    } catch (error) {
      message.error(error.message);
    }
  })
  .takeEvery(asyncRunExtension.started, function*({ extension, pathname }, { call, put, select }) {
    let result;
    const { run, afterRun, destroy } = extension;
    if (run) {
      result = yield call(browserService.sendActionToCurrentTab, runScript(run));
    }
    const state: GlobalStore = yield select(state => state);
    const data = state.clipper.clipperData[pathname];
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
      changeData({
        data: result,
        pathName: pathname,
      })
    );
  });

builder.subscript(async function initStore({ dispatch }) {
  const result = await storage.getPreference();
  const tabInfo = await browserService.getCurrentTab();
  dispatch(initTabInfo({ title: tabInfo.title, url: tabInfo.url }));
  dispatch(removeActionNamespace(initUserPreference(result)));
  const { accounts, defaultAccountId: id } = result;
  if (accounts.length === 0 || !id || accounts.every(o => o.id !== id)) {
    dispatch(routerRedux.push('/preference'));
    return;
  }
  dispatch(asyncChangeAccount.started({ id }));
  if (result.defaultPluginId) {
    dispatch(routerRedux.push(`/plugins/${result.defaultPluginId}`));
  }
});

export default builder.build();
