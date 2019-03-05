import backendService, {
  documentServiceFactory,
  imageHostingServiceFactory
} from '../../services/backend';
import browserService from '../../services/browser';
import storage from '../../services/common/store';
import { all, call, put, spawn, delay } from 'redux-saga/effects';
import { asyncFetchRepositorySaga, clipperRootSagas } from './clipper';
import { asyncFetchUserInfoSaga, userInfoRootSagas } from './userInfo';
import { BrowserTab } from './../../services/browser/index';
import { initTabInfo } from '../actions/clipper';
import { initUserPreference } from '../actions/userPreference';
import { push } from 'connected-react-router';
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
  console.log(window.location.href);
  const result: PreferenceStorage = yield call(storage.getPreference);
  const tabInfo: BrowserTab = yield call(browserService.getCurrentTab);
  backendService.setImageHostingService(
    imageHostingServiceFactory({ type: 'yuque' })
  );
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
  if (result.defaultPluginId) {
    yield put(push('/plugins/' + result.defaultPluginId));
  }
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
