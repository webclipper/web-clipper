import { spawn, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { initUserPreference } from '../actions/userPreference';
import { asyncFetchUserInfo } from '../actions/userInfo';

import storage, { StorageUserInfo } from '../../services/common/store';
import backendService from '../../services/backend';
import { userInfoRootSagas } from './userInfo';

const makeRestartable = (saga: any) => {
  return function* () {
    yield spawn(function* () {
      while (true) {
        try {
          yield call(saga);
          console.error('unexpected root saga termination.', saga);
        } catch (e) {
          console.error('Saga error, the saga will be restarted', e);
        }
        yield delay(1000);
      }
    });
  };
};

function* initStore() {
  const result: StorageUserInfo = yield call(storage.getUserSetting);
  //todo 判断是否有token
  const checkToken = true;
  if (checkToken) {
    backendService.config({
      accessToken: result.token,
      baseURL: result.baseURL,
      type: 'yuque'
    });
    //todo 配置转换
    const userPreferenceStore = result;
    yield put(initUserPreference({ userPreferenceStore }));
    yield put(asyncFetchUserInfo.started());
  } else {
    //todo gotoSettingPage
  }
}

export const rootSagas = [userInfoRootSagas].map(makeRestartable);

export default function* root() {
  yield rootSagas.map(saga => call(saga));
  yield call(initStore);
}
