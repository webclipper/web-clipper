import { asyncFetchLatestVersion } from './../actions/version';
import { GlobalStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import packageJson from '../../package.json';
import axios from 'axios';
import { hasUpdate } from '@/common/version';

const defaultState: GlobalStore['version'] = {
  remoteVersion: '0.0.0',
  localVersion: packageJson.version,
  hasUpdate: false,
};
const model = new DvaModelBuilder(defaultState, 'version')
  .takeEvery(asyncFetchLatestVersion.started, function*(_, { call, put }) {
    try {
      const url = 'https://api.github.com/repos/webclipper/web-clipper/releases/latest';
      const response = yield call(axios.get, url);
      const remoteVersion = response.data.tag_name.slice(1);
      yield put(asyncFetchLatestVersion.done({ result: remoteVersion }));
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
