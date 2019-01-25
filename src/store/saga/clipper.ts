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
  asyncCreateRepository,
  asyncCreateDocument
} from '../actions/clipper';
import backend from '../../services/backend';
import { message } from 'antd';
import { push } from 'connected-react-router';

export function* asyncFetchRepositorySaga() {
  try {
    const response: Repository[] = yield call(
      backend.getDocumentService().getRepositories
    );
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

export function* asyncCreateDocumentSaga() {
  const selector = (state: GlobalStore) => {
    return {
      currentRepository: state.clipper.currentRepository
    };
  };

  const selectState: ReturnType<typeof selector> = yield select(selector);
  if (!selectState.currentRepository) {
    message.error('必须选择一个知识库');
    return;
  }
  yield put(asyncCreateDocument.done({}));
  yield put(push('/complete'));
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

export function* watchAsyncCreateDocumentSaga() {
  yield takeLatest(asyncCreateDocument.started.type, asyncCreateDocumentSaga);
}

export function* watchAsyncFetchRepositorySaga() {
  yield takeEvery(asyncFetchRepository.started.type, asyncFetchRepositorySaga);
}

export function* clipperRootSagas() {
  yield fork(watchAsyncCreateRepositorySaga);
  yield fork(watchAsyncFetchRepositorySaga);
  yield fork(watchAsyncCreateDocumentSaga);
}
