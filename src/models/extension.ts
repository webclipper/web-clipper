import storage from 'common/storage';
import { GlobalStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import {
  loadExtensions,
  setDefaultExtensionId,
  installRemoteExtension,
  toggleDisableExtension,
} from '@/actions/extension';
import { extensions } from 'extensions/index';
import { localStorageService } from '@/common/chrome/storage';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/modelTypes/userPreference';
import { getLocaleExtensionManifest, SerializedExtensionWithId } from '@web-clipper/extensions';
import {
  LOCAL_EXTENSIONS_EXTENSIONS_KEY,
  LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY,
} from '@/common/modelTypes/extensions';

const initStore: GlobalStore['extension'] = {
  extensions: [],
  disabledExtensions: [],
};

const builder = new DvaModelBuilder(initStore, 'extension');

builder.takeEvery(toggleDisableExtension, function*(payload, { call, put }) {
  let disabledExtensions = JSON.parse(
    localStorageService.get(LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY, '[]')
  ) as string[];
  const newDisabledExtensions = disabledExtensions.filter(o => o !== payload);
  if (newDisabledExtensions.length === disabledExtensions.length) {
    newDisabledExtensions.push(payload);
  }
  yield call(
    localStorageService.set,
    LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY,
    JSON.stringify(newDisabledExtensions)
  );

  yield put(loadExtensions.started());
});

builder
  .takeEvery(setDefaultExtensionId.started, function*(id, { call, put }) {
    const defaultExtensionId = yield call(storage.getDefaultPluginId);
    if (defaultExtensionId === id) {
      yield call(storage.setDefaultPluginId, null);
    } else {
      yield call(storage.setDefaultPluginId, id);
    }
    const newId = yield call(storage.getDefaultPluginId);
    yield put(setDefaultExtensionId.done({ params: newId }));
  })
  .case(setDefaultExtensionId.done, (state, { params }) => ({
    ...state,
    defaultExtensionId: params,
  }));

builder.takeEvery(installRemoteExtension.started, function*(payload, { call, put }) {
  yield call(localStorageService.set, LOCAL_EXTENSIONS_EXTENSIONS_KEY, JSON.stringify([]));
  const localeExtensions = JSON.parse(
    localStorageService.get(LOCAL_EXTENSIONS_EXTENSIONS_KEY, '[]')
  ) as SerializedExtensionWithId[];
  localeExtensions.push(payload);
  yield call(
    localStorageService.set,
    LOCAL_EXTENSIONS_EXTENSIONS_KEY,
    JSON.stringify(localeExtensions)
  );
  yield put(loadExtensions.started());
});

builder
  .subscript(async function loadExtension({ dispatch }) {
    const defaultExtensionId = await storage.getDefaultPluginId();
    if (defaultExtensionId) {
      dispatch(removeActionNamespace(setDefaultExtensionId.done({ params: defaultExtensionId })));
    }
    dispatch(removeActionNamespace(loadExtensions.started()));
  })
  .takeEvery(loadExtensions.started, function*(_, { put }) {
    const locale = localStorageService.get(LOCAL_USER_PREFERENCE_LOCALE_KEY, navigator.language);
    const localeExtensions = JSON.parse(
      localStorageService.get(LOCAL_EXTENSIONS_EXTENSIONS_KEY, '[]')
    ) as SerializedExtensionWithId[];
    let disabledExtensions = JSON.parse(
      localStorageService.get(LOCAL_EXTENSIONS_DISABLED_EXTENSIONS_KEY, '[]')
    ) as string[];
    const internalExtensions = extensions.concat(localeExtensions).map(e => ({
      ...e,
      manifest: getLocaleExtensionManifest(e.manifest, locale),
    }));
    yield put(
      loadExtensions.done({
        result: {
          extensions: internalExtensions,
          disabledExtensions,
        },
      })
    );
  })
  .case(loadExtensions.done, (state, { result: { extensions, disabledExtensions } }) => ({
    ...state,
    extensions,
    disabledExtensions,
  }));

export default builder.build();
