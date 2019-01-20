import {
  takeEvery,
  fork,
  call,
  put,
  takeLatest,
  select
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  asyncFetchRepository,
  asyncCreateRepository
} from '../actions/clipper';
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

export function* asyncCreateRepositorySaga() {
  try {
    const title = yield select((state: GlobalStore) => {
      return state.clipper.selectRepository.repositoryTitle;
    });
    yield delay(1000);
    yield put(asyncCreateRepository.done({}));
    console.log('create repository', title);
  } catch (error) {
    console.log(error);
    //todo 判断错误还是网络超时
  }
}

export function* watchAsyncCreateRepositorySaga() {
  yield takeLatest(
    asyncCreateRepository.started.type,
    asyncCreateRepositorySaga
  );
}

export function* watchAsyncFetchRepositorySaga() {
  yield takeEvery(asyncFetchRepository.started.type, asyncFetchRepositorySaga);
}

export function* clipperRootSagas() {
  yield fork(watchAsyncCreateRepositorySaga);
  yield fork(watchAsyncFetchRepositorySaga);
}
