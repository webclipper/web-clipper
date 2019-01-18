import { takeEvery, fork, call, put } from 'redux-saga/effects';
import { asyncFetchUserInfo } from '../actions/userInfo';
import backend from '../../services/backend';

export function* asyncFetchUserInfoSaga() {
  try {
    const response: UserInfo = yield call(backend.service.getUserInfo);
    yield put(
      asyncFetchUserInfo.done({
        result: {
          userInfo: response
        }
      })
    );
  } catch (error) {
    console.log(error);
    //todo 判断错误还是网络超时
  }
}

export function* watchAsyncFetchUserInfoSaga() {
  yield takeEvery(asyncFetchUserInfo.started.type, asyncFetchUserInfoSaga);
}

export function* userInfoRootSagas() {
  yield fork(watchAsyncFetchUserInfoSaga);
}
