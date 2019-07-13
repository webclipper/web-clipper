import { asyncFetchLatestVersion } from './../actions/version';
import { GlobalStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import packageJson from '../../package.json';
import axios from 'axios';

const defaultState: GlobalStore['version'] = {
  localVersion: packageJson.version,
};
const model = new DvaModelBuilder(defaultState, 'version')
  .takeEvery(asyncFetchLatestVersion.started, function*(_, { call, put }) {
    try {
      const url = 'https://api.github.com/repos/webclipper/web-clipper/releases/latest';
      const response = yield call(axios.get, url);
      const removeVersion = response.data.tag_name.slice(1);
      yield put(asyncFetchLatestVersion.done({ result: removeVersion }));
    } catch (_error) {}
  })
  .case(asyncFetchLatestVersion.done, (state, { result: removeVersion }) => ({
    ...state,
    removeVersion,
  }));

model.subscript(function fetchRemoteVersion({ dispatch }) {
  dispatch(removeActionNamespace(asyncFetchLatestVersion.started()));
});

export default model.build();
