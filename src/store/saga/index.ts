import { BrowserTab } from './../../services/browser/index';
import { spawn, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { initUserPreference } from '../actions/userPreference';
import storage from '../../services/common/store';
import backendService, { documentServiceFactory } from '../../services/backend';
import { userInfoRootSagas, asyncFetchUserInfoSaga } from './userInfo';
import { clipperRootSagas, asyncFetchRepositorySaga } from './clipper';
import { userPreferenceSagas } from './userPreference';
import browserService from '../../services/browser';
import { initTabInfo } from '../actions/clipper';
import { push } from 'connected-react-router';

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
  const result: PreferenceStorage = yield call(storage.getPreference);
  if (result.accounts.length === 0) {
    yield put(push('/preference'));
    return;
  }
  const { accounts, currentAccountIndex } = result;
  yield put(initUserPreference(result));
  const account = accounts[currentAccountIndex];
  const documentService = documentServiceFactory({
    accessToken: account.accessToken,
    baseURL: account.host,
    type: account.type
  });
  backendService.setDocumentService(documentService);
  const tabInfo: BrowserTab = yield call(browserService.getCurrentTab);
  yield put(initTabInfo({ title: tabInfo.title, url: tabInfo.url }));
  yield call(asyncFetchUserInfoSaga);
  yield call(asyncFetchRepositorySaga);
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
