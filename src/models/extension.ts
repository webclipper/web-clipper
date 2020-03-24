import { ITrackService } from '@/service/common/track';
import { GlobalStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import { loadExtensions } from '@/actions/extension';
import { extensions } from 'extensions/index';
import { localStorageService } from '@/common/chrome/storage';
import { LOCAL_USER_PREFERENCE_LOCALE_KEY } from '@/common/modelTypes/userPreference';
import { getLocaleExtensionManifest } from '@web-clipper/extensions';
import Container from 'typedi';

const initStore: GlobalStore['extension'] = {
  extensions: [],
};

const builder = new DvaModelBuilder(initStore, 'extension');

builder
  .subscript(async function loadExtension({ dispatch }) {
    dispatch(removeActionNamespace(loadExtensions.started()));
  })
  .takeEvery(loadExtensions.started, function*(_, { put }) {
    const locale = localStorageService.get(LOCAL_USER_PREFERENCE_LOCALE_KEY, navigator.language);
    const internalExtensions = extensions.map(e => ({
      ...e,
      manifest: getLocaleExtensionManifest(e.manifest, locale),
    }));
    yield put(
      loadExtensions.done({
        result: {
          extensions: internalExtensions,
        },
      })
    );
  })
  .case(loadExtensions.done, (state, { result: { extensions } }) => ({
    ...state,
    extensions,
  }));

builder.subscript(function trackLoadPage({ history }) {
  history.listen(e => {
    Container.get(ITrackService).trackEvent('Open_Page', e.pathname);
  });
});

export default builder.build();
