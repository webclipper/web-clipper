import { BrowserTab } from './../../services/browser/index';
import { spawn, call, put, all } from 'redux-saga/effects';
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
  const tabInfo: BrowserTab = yield call(browserService.getCurrentTab);
  yield put(initTabInfo({ title: tabInfo.title, url: tabInfo.url }));
  if (result.accounts.length === 0) {
    yield put(push('/preference'));
    return;
  }
  const { accounts, defaultAccountId } = result;
  yield put(initUserPreference(result));
  const defaultAccountIndex = accounts.findIndex(
    o => o.id === defaultAccountId
  );
  const account =
    defaultAccountIndex === -1 ? accounts[0] : accounts[defaultAccountIndex];
  const documentService = documentServiceFactory({
    accessToken: account.accessToken,
    baseURL: account.host,
    type: account.type
  });
  backendService.setDocumentService(documentService);
  yield call(asyncFetchUserInfoSaga);
  yield call(asyncFetchRepositorySaga);
}

export const rootSagas = [
  userInfoRootSagas,
  clipperRootSagas,
  userPreferenceSagas
].map(makeRestartable);

export default function* root() {
  yield all(rootSagas.map(saga => call(saga)));
  yield call(initStore);
}
