import storage from 'common/storage';
import { GlobalStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import { loadExtensions, setDefaultExtensionId } from '@/actions/extension';
import { extensions } from 'extensions/index';

const initStore: GlobalStore['extension'] = {
  extensions: [],
};

const builder = new DvaModelBuilder(initStore, 'extension').case(
  loadExtensions,
  (state, extensions) => ({
    ...state,
    extensions,
  })
);

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

builder.subscript(async ({ dispatch }) => {
  const defaultExtensionId = await storage.getDefaultPluginId();
  if (defaultExtensionId) {
    dispatch(removeActionNamespace(setDefaultExtensionId.done({ params: defaultExtensionId })));
  }
  dispatch(removeActionNamespace(loadExtensions(extensions)));
});

export default builder.build();
