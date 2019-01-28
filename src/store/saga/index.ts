import { spawn, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { initUserPreference } from '../actions/userPreference';
import storage, { StorageUserInfo } from '../../services/common/store';
import backendService, { documentServiceFactory } from '../../services/backend';
import { userInfoRootSagas, asyncFetchUserInfoSaga } from './userInfo';
import { clipperRootSagas, asyncFetchRepositorySaga } from './clipper';
import { userPreferenceSagas } from './userPreference';

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
  const checkToken = true;
  if (checkToken) {
    const documentService = documentServiceFactory({
      accessToken: result.token,
      baseURL: result.baseURL,
      type: 'yuque'
    });
    backendService.setDocumentService(documentService);

    let defaultBookId;
    if (result.defualtBookId) {
      defaultBookId = String(result.defualtBookId);
    }

    const userPreferenceStore = {
      defaultRepositoryId: defaultBookId,
      defaultClipperType: result.defaultClipperType,
      accessToken: result.token,
      baseHost: result.baseURL
    };
    yield call(asyncFetchUserInfoSaga);
    yield call(asyncFetchRepositorySaga);
    yield put(initUserPreference({ userPreferenceStore }));
  } else {
    //todo gotoSettingPage
  }
}

export const rootSagas = [
  userInfoRootSagas,
  clipperRootSagas,
  userPreferenceSagas
].map(makeRestartable);

export default function* root() {
  yield rootSagas.map(saga => call(saga));
  yield call(initStore);
}
