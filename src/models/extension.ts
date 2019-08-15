import update from 'immutability-helper';
import storage from 'common/storage';
import { GlobalStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import { loadExtensions, setDefaultExtensionId } from '@/actions/extension';
import { extensions } from 'extensions/index';
import { localStorageService } from '@/common/chrome/storage';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/modelTypes/userPreference';
import { SerializedExtensionWithId } from '@web-clipper/extensions';

const initStore: GlobalStore['extension'] = {
  extensions: [],
};

const builder = new DvaModelBuilder(initStore, 'extension');

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
    const internalExtensions = extensions.map(
      (e): SerializedExtensionWithId => {
        const { i18nManifest } = e.manifest;
        let localeManifest: Partial<SerializedExtensionWithId['manifest']> = {};
        if (i18nManifest && typeof i18nManifest === 'object') {
          localeManifest = i18nManifest[locale];
        }
        return update(e, {
          manifest: {
            $merge: localeManifest || {},
          },
        });
      }
    );
    yield put(
      loadExtensions.done({
        result: internalExtensions,
      })
    );
  })
  .case(loadExtensions.done, (state, { result: extensions }) => ({
    ...state,
    extensions,
  }));

export default builder.build();
