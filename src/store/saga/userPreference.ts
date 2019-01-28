import { message } from 'antd';
import { takeEvery, fork, select, call, put } from 'redux-saga/effects';
import {
  asyncPostInitializeForm,
  asyncChangeDefaultRepository
} from '../actions/userPreference';
import { AnyAction, isType } from 'typescript-fsa';
import { documentServiceFactory } from '../../services/backend';
import storage from '../../services/common/store';

export function* asyncPostInitializeFormSaga() {
  try {
    const selector = ({ userPreference }: GlobalStore) => {
      return {
        initializeForm: userPreference.initializeForm,
        accessToken: userPreference.accessToken,
        baseHost: userPreference.baseHost
      };
    };
    const selectState: ReturnType<typeof selector> = yield select(selector);
    const { baseHost, initializeForm, accessToken } = selectState;

    let host = baseHost;
    if (initializeForm.host) {
      host = initializeForm.host.value;
    }
    if (!host) {
      return;
    }
    let token = accessToken;
    if (initializeForm.token) {
      token = initializeForm.token.value;
    }
    if (!token) {
      return;
    }
    const documentService = documentServiceFactory({
      type: 'yuque',
      accessToken: token,
      baseURL: host
    });

    const userInfo = yield call(documentService.getUserInfo);

    const repositories = yield call(documentService.getRepositories);
    storage.setUserSetting({
      token: token,
      baseURL: host
    });

    yield put(
      asyncPostInitializeForm.done({
        result: {
          userInfo,
          repositories
        }
      })
    );
    message.success('设置成功');
  } catch (error) {
    message.error('AccessToken 错误或者域名错误');
    yield put(
      asyncPostInitializeForm.failed({
        error: {
          error
        }
      })
    );
  }
}

export function* changeDefaultRepositorySaga(action: AnyAction) {
  if (isType(action, asyncChangeDefaultRepository.started)) {
    yield call(storage.setDefaultBookId, action.payload.defaultRepositoryId);
    yield put(
      asyncChangeDefaultRepository.done({
        params: {
          defaultRepositoryId: action.payload.defaultRepositoryId
        }
      })
    );
    message.success('更新默认知识库成功');
  }
}

export function* watchChangeDefaultRepositorySaga() {
  yield takeEvery(
    asyncChangeDefaultRepository.started,
    changeDefaultRepositorySaga
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
  yield fork(watchChangeDefaultRepositorySaga);
}
