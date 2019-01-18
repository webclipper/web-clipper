import { takeEvery, fork, call, put } from 'redux-saga/effects';
import { asyncFetchRepository } from '../actions/clipper';
import backend from '../../services/backend';

export function* asyncFetchRepositorySaga() {
  try {
    const response: Repository[] = yield call(backend.service.getRepositories);
    yield put(
      asyncFetchRepository.done({
        result: {
          repositories: response
        }
      })
    );
  } catch (error) {
    console.log(error);
    //todo 判断错误还是网络超时
  }
}

export function* watchAsyncFetchRepositorySaga() {
  yield takeEvery(asyncFetchRepository.started.type, asyncFetchRepositorySaga);
}

export function* clipperRootSagas() {
  yield fork(watchAsyncFetchRepositorySaga);
}
