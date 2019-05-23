import browserService, { BrowserTab } from 'common/browser';
import storage, { PreferenceStorage } from 'common/storage';
import { all, call, put, spawn, delay, fork } from 'redux-saga/effects';
import { clipperRootSagas } from './clipper';
import {
  initTabInfo,
  initUserPreference,
  asyncChangeAccount,
  setRemoteVersion,
} from 'actions';
import { push } from 'connected-react-router';
import { userPreferenceSagas } from './userPreference';
import { getRemoteVersion } from 'common/version';

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
  yield put(initTabInfo({ title: tabInfo.title, url: tabInfo.url }));
  yield put(initUserPreference(result));
  const { accounts, defaultAccountId: id } = result;
  if (accounts.length === 0 || !id || accounts.every(o => o.id !== id)) {
    yield put(push('/preference'));
    return;
  }
  yield put(asyncChangeAccount.started({ id }));
  if (result.defaultPluginId) {
    yield put(push(`/plugins/${result.defaultPluginId}`));
  }
}

function* loadVersion() {
  try {
    const version = yield call(getRemoteVersion);
    yield put(setRemoteVersion(version));
    console.log('remote version', version);
  } catch (error) {
    console.log(error);
  }
}

export const rootSagas = [clipperRootSagas, userPreferenceSagas].map(
  makeRestartable
);

export default function* root() {
  yield all(rootSagas.map(saga => call(saga)));
  yield fork(loadVersion);
  yield call(initStore);
}
