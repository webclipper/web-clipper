import backend, { documentServiceFactory } from '../../services/backend';
import { AnyAction, isType } from 'typescript-fsa';
import {
  asyncChangeAccount,
  asyncCreateDocument,
  asyncCreateRepository,
  asyncFetchRepository,
  asyncRunPlugin
} from '../actions/clipper';
import {
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { message } from 'antd';
import { push } from 'connected-react-router';
import { sendActionToCurrentTab } from '../../utils/browser';

export function* clipperRootSagas() {
  yield fork(watchAsyncRunPluginSaga);
  yield fork(watchAsyncCreateRepositorySaga);
  yield fork(watchAsyncFetchRepositorySaga);
  yield fork(watchAsyncCreateDocumentSaga);
  yield fork(watchAsyncChangeAccountSaga);
}

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
    yield put(
      asyncFetchRepository.failed({
        error: error
      })
    );
  }
}

export function* asyncCreateDocumentSaga() {
  const selector = ({
    clipper,
    router,
    userPreference: { accounts }
  }: GlobalStore) => {
    const currentAccount = accounts.find(
      o => o.id === clipper.currentAccountId
    );
    return {
      currentRepository: clipper.currentRepository,
      defaultRepositoryId: currentAccount
        ? currentAccount.defaultRepositoryId
        : '',
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
    yield put(
      asyncCreateDocument.failed({
        error: null
      })
    );
    message.error('必须选择一个知识库');
    return;
  }
  if (!title) {
    yield put(
      asyncCreateDocument.failed({
        error: null
      })
    );
    message.error('标题不允许为空');
    return;
  }
  const data = clipperData[router.location.pathname];
  if (!data) {
    yield put(
      asyncCreateDocument.failed({
        error: null
      })
    );
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
    const { href: documentHref, documentId } = response;
    yield put(
      asyncCreateDocument.done({
        result: {
          documentHref,
          repositoryId: response.repositoryId,
          documentId
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
    yield call(backend.getDocumentService().createRepository, {
      name: title,
      private: true
    });
    yield put(asyncCreateRepository.done({}));
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
    const result: string = yield call(sendActionToCurrentTab, action);
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

export function* asyncChangeAccountSaga(action: AnyAction) {
  if (isType(action, asyncChangeAccount.started)) {
    const id = action.payload.id;
    const selector = ({ userPreference: { accounts }}: GlobalStore) => {
      return {
        accounts
      };
    };
    const selectState: ReturnType<typeof selector> = yield select(selector);

    const { accounts } = selectState;

    const account = accounts.find(o => o.id === id);
    if (!account) {
      throw new Error('');
    }
    const documentService = documentServiceFactory({
      accessToken: account.accessToken,
      baseURL: account.host,
      type: account.type
    });
    const repositories = yield call(documentService.getRepositories);
    backend.setDocumentService(documentService);
    yield delay(1000);
    yield put(
      asyncChangeAccount.done({
        params: {
          id
        },
        result: {
          repositories
        }
      })
    );
  }
}

export function* watchAsyncChangeAccountSaga() {
  yield takeEvery(asyncChangeAccount.started.type, asyncChangeAccountSaga);
}
