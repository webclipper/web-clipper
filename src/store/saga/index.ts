import backendService, {
  documentServiceFactory,
  imageHostingServiceFactory,
} from '../../common/backend';
import storage from '../../common/storage';
import { all, call, put, spawn, delay } from 'redux-saga/effects';
import { asyncFetchRepositorySaga, clipperRootSagas } from './clipper';
import browserService, { BrowserTab } from '../../common/browser';
import { initTabInfo } from '../actions/clipper';
import { initUserPreference } from '../actions/userPreference';
import { push } from 'connected-react-router';
import { userPreferenceSagas } from './userPreference';

const makeRestartable = (saga: any) => {
  return function*() {
    yield spawn(function*() {
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
  backendService.setImageHostingService(imageHostingServiceFactory('yuque'));
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
  const { type, ...info } = account;
  const documentService = documentServiceFactory(type, info);
  backendService.setDocumentService(documentService);
  yield call(asyncFetchRepositorySaga);
  if (result.defaultPluginId) {
    yield put(push('/plugins/' + result.defaultPluginId));
  }
}

export const rootSagas = [clipperRootSagas, userPreferenceSagas].map(
  makeRestartable
);

export default function* root() {
  yield all(rootSagas.map(saga => call(saga)));
  yield call(initStore);
}
