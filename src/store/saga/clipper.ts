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
  asyncCreateDocument,
  asyncRunPlugin
} from '../actions/clipper';
import backend from '../../services/backend';
import { message } from 'antd';
import { push } from 'connected-react-router';
import { isType, AnyAction } from 'typescript-fsa';

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
  const selector = ({ clipper, router }: GlobalStore) => {
    return {
      currentRepository: clipper.currentRepository,
      defaultRepositoryId: '',
      clipperData: clipper.clipperData,
      router,
      title: clipper.title
    };
  };

  const selectState: ReturnType<typeof selector> = yield select(selector);
  const {
    currentRepository,
    defaultRepositoryId,
    title,
    router,
    clipperData
  } = selectState;

  let repositoryId;
  if (defaultRepositoryId) {
    repositoryId = defaultRepositoryId;
  }
  if (currentRepository) {
    repositoryId = currentRepository.id;
  }
  if (!repositoryId) {
    message.error('必须选择一个知识库');
    return;
  }
  if (!title) {
    message.error('标题不允许为空');
    return;
  }
  const data = clipperData[router.location.pathname];
  if (!data) {
    message.error('no data');
    return;
  }
  if (data.type === 'text') {
    const response: CreateDocumentResponse = yield call(
      backend.getDocumentService().createDocument,
      {
        title: title,
        private: true,
        repositoryId,
        content: data.data
      }
    );
    yield put(
      asyncCreateDocument.done({
        result: {
          documentHref: response.href
        }
      })
    );
    yield put(push('/complete'));
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

export function* watchAsyncCreateDocumentSaga() {
  yield takeLatest(asyncCreateDocument.started.type, asyncCreateDocumentSaga);
}

export function* watchAsyncFetchRepositorySaga() {
  yield takeEvery(asyncFetchRepository.started.type, asyncFetchRepositorySaga);
}

export function* asyncRunPluginSaga(action: any) {
  if (isType(action, asyncRunPlugin.started)) {
    const result: string = yield gerResult(action);
    yield put(
      asyncRunPlugin.done({
        params: action.payload,
        result: { result }
      })
    );
  }
}
export function* watchAsyncRunPluginSaga() {
  yield takeEvery(asyncRunPlugin.started.type, asyncRunPluginSaga);
}

export function* clipperRootSagas() {
  yield fork(watchAsyncRunPluginSaga);
  yield fork(watchAsyncCreateRepositorySaga);
  yield fork(watchAsyncFetchRepositorySaga);
  yield fork(watchAsyncCreateDocumentSaga);
}

const gerResult = function<T>(action: AnyAction): Promise<T> {
  return new Promise<T>((resolve, _) => {
    chrome.tabs.getCurrent((tab: any) => {
      chrome.tabs.sendMessage(tab.id, action, (re: T) => {
        resolve(re);
      });
    });
  });
};
