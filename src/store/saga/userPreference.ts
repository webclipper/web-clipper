import { takeEvery, fork, select, call, put } from 'redux-saga/effects';
import { asyncPostInitializeForm } from '../actions/userPreference';
import { documentServiceFactory } from '../../services/backend';
import storage from '../../services/common/store';

export function* asyncPostInitializeFormSaga() {
  const form: InitializeForm = yield select((state: GlobalStore) => {
    return state.userPreference.initializeForm;
  });
  const documentService = documentServiceFactory({
    type: 'yuque',
    accessToken: form.token.value,
    baseURL: `${form.host.value}/api/v2`
  });
  const repositories = yield call(documentService.getRepositories);
  storage.setUserSetting({
    token: form.token.value,
    baseURL: `${form.host.value}/api/v2`
  });
  yield put(
    asyncPostInitializeForm.done({
      result: {
        repositories
      }
    })
  );
}

export function* watchAsyncPostInitializeFormSaga() {
  yield takeEvery(
    asyncPostInitializeForm.started.type,
    asyncPostInitializeFormSaga
  );
}

export function* userPreferenceSagas() {
  yield fork(watchAsyncPostInitializeFormSaga);
}
