import { asyncFetchLatestVersion } from './../actions/version';
import { GlobalStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import packageJson from '../../package.json';
import request from 'umi-request';
import { hasUpdate } from '@/common/version';
import config, { RemoteConfig } from '@/config';

const defaultState: GlobalStore['version'] = {
  remoteVersion: '0.0.0',
  localVersion: packageJson.version,
  hasUpdate: false,
};
const model = new DvaModelBuilder(defaultState, 'version')
  .takeEvery(asyncFetchLatestVersion.started, function*(_, { call, put }) {
    try {
      const response: RemoteConfig = yield call(request.get, `${config.resourceHost}/config.json`);
      yield put(asyncFetchLatestVersion.done({ result: response.chromeWebStoreVersion }));
    } catch (_error) {
      console.log(_error);
    }
  })
  .case(asyncFetchLatestVersion.done, (state, { result: remoteVersion }) => ({
    ...state,
    remoteVersion,
    hasUpdate: hasUpdate(remoteVersion, state.localVersion),
  }));

model.subscript(function fetchRemoteVersion({ dispatch }) {
  dispatch(removeActionNamespace(asyncFetchLatestVersion.started()));
});

export default model.build();
