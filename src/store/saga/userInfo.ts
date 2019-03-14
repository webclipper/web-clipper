import backend from '../../services/backend';
import { asyncFetchUserInfo } from '../actions/userInfo';
import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { push } from 'connected-react-router';

export function* asyncFetchUserInfoSaga() {
  try {
    const response: UserInfo = yield call(
      backend.getDocumentService().getUserInfo
    );
    yield put(
      asyncFetchUserInfo.done({
        result: {
          userInfo: response,
        },
      })
    );
  } catch (error) {
    yield put(push('/preference'));
    //todo 判断错误还是网络超时
  }
}

export function* watchAsyncFetchUserInfoSaga() {
  yield takeEvery(asyncFetchUserInfo.started.type, asyncFetchUserInfoSaga);
}

export function* userInfoRootSagas() {
  yield fork(watchAsyncFetchUserInfoSaga);
}
