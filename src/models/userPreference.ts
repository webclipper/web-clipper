import { ITrackService } from '@/service/common/track';
import { IContentScriptService } from '@/service/common/contentScript';
import { ITabService } from '@/service/common/tab';
import { Container } from 'typedi';
import React from 'react';
import { getLanguage } from './../common/locales';
import localeService from '@/common/locales';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from './../common/modelTypes/userPreference';
import storage from 'common/storage';
import * as antd from 'antd';
import { GlobalStore } from '@/common/types';
import update from 'immutability-helper';
import {
  asyncSetEditorLiveRendering,
  initUserPreference,
  asyncDeleteImageHosting,
  asyncAddImageHosting,
  asyncEditImageHosting,
  asyncRunExtension,
  setLocale,
  asyncSetLocaleToStorage,
  initServices,
  asyncSetIconColor,
} from 'pageActions/userPreference';
import { initTabInfo, changeData, asyncChangeAccount } from 'pageActions/clipper';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import { UserPreferenceStore } from 'common/types';
import { getServices, getImageHostingServices, imageHostingServiceFactory } from 'common/backend';
import { ToolContext } from '@/extensions/common';
import backend from 'common/backend/index';
import { loadImage } from 'common/blob';
import { routerRedux } from 'dva';
import { localStorageService, syncStorageService } from '@/common/chrome/storage';
import { initAccounts } from '@/actions/account';
import copyToClipboard from 'copy-to-clipboard';
import { ocr, clearly } from '@/common/server';
import remark from 'remark';
import remakPangu from '@web-clipper/remark-pangu';

const { message } = antd;

const defaultState: UserPreferenceStore = {
  locale: getLanguage(),
  imageHosting: [],
  servicesMeta: {},
  imageHostingServicesMeta: {},
  liveRendering: true,
  iconColor: 'auto',
};

const builder = new DvaModelBuilder(defaultState, 'userPreference')
  .case(asyncSetIconColor.done, (state, { result: { value: iconColor } }) => ({
    ...state,
    iconColor,
  }))
  .case(asyncSetEditorLiveRendering.done, (state, { result: { value: liveRendering } }) => ({
    ...state,
    liveRendering,
  }))
  .case(initUserPreference, (state, payload) => ({
    ...state,
    ...payload,
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
  );

builder
  .takeEvery(asyncSetIconColor.started, function*({ value }, { call, put }) {
    yield call(storage.setIconColor, value);
    yield put(
      asyncSetIconColor.done({
        params: {
          value,
        },
        result: {
          value: value,
        },
      })
    );
  })
  .takeEvery(asyncSetEditorLiveRendering.started, function*({ value }, { call, put }) {
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
    const imageHostingList: PromiseType<ReturnType<
      typeof storage.deleteImageHostingById
    >> = yield call(storage.deleteImageHostingById, payload.id);
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
    const contentScriptService = Container.get(IContentScriptService);
    let result;
    const {
      extensionLifeCycle: { run, afterRun, destroy },
      id,
    } = extension;
    const tabService = Container.get(ITabService);
    if (run) {
      result = yield call(contentScriptService.runScript, id, 'run');
    }
    const state: GlobalStore = yield select(state => state);
    const data = state.clipper.clipperData[pathname];

    function createAndDownloadFile(fileName: string, content: string | Blob) {
      let aTag = document.createElement('a');
      let blob: Blob;
      if (typeof content === 'string') {
        blob = new Blob([content]);
      } else {
        blob = content;
      }
      aTag.download = fileName;
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(aTag.href);
    }
    async function pangu(document: string): Promise<string> {
      const result = await remark()
        .use(remakPangu)
        .process(document);
      return result.contents as string;
    }
    if (afterRun) {
      try {
        const context: ToolContext<any, any> = {
          locale: state.userPreference.locale,
          result,
          data,
          message,
          imageService: backend.getImageHostingService(),
          loadImage: loadImage,
          captureVisibleTab: tabService.captureVisibleTab,
          copyToClipboard,
          createAndDownloadFile,
          antd,
          React,
          pangu,
          ocr: async r => {
            const response = await ocr(r);
            return response.result;
          },
          clearly: async r => {
            const response = await clearly(r);
            return response.result;
          },
        };
        result = yield call(afterRun, context);
      } catch (error) {
        message.error(error.message);
      }
    }
    if (destroy) {
      contentScriptService.runScript(id, 'destroy');
    }
    yield put(
      changeData({
        data: result,
        pathName: pathname,
      })
    );
  });

builder.subscript(async function initStore({ dispatch, history }) {
  await dispatch(initAccounts.started());
  const result = await storage.getPreference();
  const tabService = Container.get(ITabService);
  const tabInfo = await tabService.getCurrent();
  if (tabInfo.title && tabInfo.url) {
    dispatch(initTabInfo({ title: tabInfo.title, url: tabInfo.url }));
  }
  dispatch(removeActionNamespace(initUserPreference(result)));
  if (history.location.pathname !== '/' && history.location.pathname !== '/editor') {
    return;
  }
  if (result.defaultPluginId) {
    dispatch(routerRedux.push(`/plugins/${result.defaultPluginId}`));
  }
  const defaultAccountId = syncStorageService.get('defaultAccountId');
  if (defaultAccountId) {
    dispatch(asyncChangeAccount.started({ id: defaultAccountId }));
  }
});

builder
  .takeEvery(asyncSetLocaleToStorage, function*(locale, { call }) {
    yield call(localStorageService.set, LOCAL_USER_PREFERENCE_LOCALE_KEY, locale);
  })
  .subscript(async function initLocal({ dispatch }) {
    const locale = localStorageService.get(LOCAL_USER_PREFERENCE_LOCALE_KEY, navigator.language);
    dispatch(removeActionNamespace(setLocale(locale)));
    localStorageService.onDidChangeStorage(key => {
      if (key === LOCAL_USER_PREFERENCE_LOCALE_KEY) {
        dispatch(
          removeActionNamespace(
            setLocale(localStorageService.get(LOCAL_USER_PREFERENCE_LOCALE_KEY, navigator.language))
          )
        );
      }
    });
  })
  .case(setLocale, (state, locale) => ({ ...state, locale }));

builder
  .subscript(async function xx({ dispatch }) {
    const servicesMeta = getServices().reduce((previousValue, meta) => {
      previousValue[meta.type] = meta;
      return previousValue;
    }, {} as UserPreferenceStore['servicesMeta']);

    const imageHostingServicesMeta = getImageHostingServices().reduce((previousValue, meta) => {
      previousValue[meta.type] = meta;
      return previousValue;
    }, {} as UserPreferenceStore['imageHostingServicesMeta']);
    dispatch(
      removeActionNamespace(
        initServices({
          imageHostingServicesMeta,
          servicesMeta,
        })
      )
    );

    localStorageService.onDidChangeStorage(async key => {
      if (key === LOCAL_USER_PREFERENCE_LOCALE_KEY) {
        await localeService.init();
        const servicesMeta = getServices().reduce((previousValue, meta) => {
          previousValue[meta.type] = meta;
          return previousValue;
        }, {} as UserPreferenceStore['servicesMeta']);
        const imageHostingServicesMeta = getImageHostingServices().reduce((previousValue, meta) => {
          previousValue[meta.type] = meta;
          return previousValue;
        }, {} as UserPreferenceStore['imageHostingServicesMeta']);
        dispatch(
          removeActionNamespace(
            initServices({
              imageHostingServicesMeta,
              servicesMeta,
            })
          )
        );
      }
    });
  })
  .case(initServices, (state, { imageHostingServicesMeta, servicesMeta }) => {
    return {
      ...state,
      imageHostingServicesMeta,
      servicesMeta,
    };
  });

builder.subscript(function trackLoadPage({ history }) {
  history.listen(e => {
    Container.get(ITrackService).trackEvent('Open_Page', e.pathname);
  });
});

export default builder.build();
