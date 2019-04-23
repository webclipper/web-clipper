import { CreateDocumentRequest } from './../../common/backend/index';
import backend, {
  documentServiceFactory,
  imageHostingServiceFactory,
} from '../../common/backend';
import { AnyAction, isType } from '../../common/typescript-fsa';
import { asyncChangeAccount, asyncCreateDocument } from '../actions';
import {
  call,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import { message } from 'antd';
import {
  SerializedExtensionWithId,
  ExtensionType,
} from '../../extensions/interface';
import { push } from 'connected-react-router';

export function* clipperRootSagas() {
  yield fork(watchAsyncCreateDocumentSaga);
  yield fork(watchAsyncChangeAccountSaga);
}

export function* asyncCreateDocumentSaga() {
  const selector = ({
    clipper,
    router,
    userPreference: { accounts, extensions },
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
      title: clipper.title,
      extensions,
      repositories: clipper.repositories,
    };
  };

  const selectState: ReturnType<typeof selector> = yield select(selector);
  const {
    currentRepository,
    defaultRepositoryId,
    title,
    router,
    clipperData,
    extensions,
    repositories,
  } = selectState;
  let repositoryId;
  if (
    defaultRepositoryId &&
    repositories.some(o => o.id === defaultRepositoryId)
  ) {
    repositoryId = defaultRepositoryId;
  }
  if (currentRepository) {
    repositoryId = currentRepository.id;
  }
  if (!repositoryId) {
    yield put(
      asyncCreateDocument.failed({
        error: null,
      })
    );
    message.error('必须选择一个知识库');
    return;
  }
  if (!title) {
    yield put(
      asyncCreateDocument.failed({
        error: null,
      })
    );
    message.error('标题不允许为空');
    return;
  }
  const data = clipperData[router.location.pathname];

  const extension: SerializedExtensionWithId = extensions.find(
    o => `/plugins/${o.id}` === router.location.pathname
  );
  if (!extension) {
    console.log(router.location.pathname);
    return;
  }
  let createDocumentRequest: CreateDocumentRequest | null = null;
  if (extension.type === ExtensionType.Text) {
    createDocumentRequest = {
      title: title,
      private: true,
      repositoryId,
      content: data as string,
    };
  }
  if (extension.type === ExtensionType.Image) {
    const imageHostingService = backend.getImageHostingService();
    if (!imageHostingService) {
      message.error('请设定图床');
      return;
    }

    try {
      const responseUrl: string = yield call(imageHostingService.uploadImage, {
        data: (data as ImageClipperData).dataUrl,
      });
      createDocumentRequest = {
        title: title,
        private: true,
        repositoryId,
        content: `![](${responseUrl})`,
      };
    } catch (_error) {
      message.error('上传图片到图床失败');
      yield put(
        asyncCreateDocument.failed({
          error: null,
        })
      );
      return;
    }
  }
  if (!createDocumentRequest) {
    return;
  }
  const response = yield call(
    backend.getDocumentService()!.createDocument,
    createDocumentRequest
  );
  const { href: documentHref, documentId } = response;
  yield put(
    asyncCreateDocument.done({
      result: {
        documentHref,
        repositoryId: response.repositoryId,
        documentId,
      },
    })
  );
  yield put(push('/complete'));
}

export function* watchAsyncCreateDocumentSaga() {
  yield takeLatest(asyncCreateDocument.started.type, asyncCreateDocumentSaga);
}

export function* asyncChangeAccountSaga(action: AnyAction) {
  if (isType(action, asyncChangeAccount.started)) {
    const id = action.payload.id;
    const selector = ({
      userPreference: { accounts, imageHosting },
    }: GlobalStore) => {
      return {
        accounts,
        imageHosting,
      };
    };
    const selectState: ReturnType<typeof selector> = yield select(selector);
    const { accounts, imageHosting } = selectState;
    const account = accounts.find(o => o.id === id);
    if (!account) {
      throw new Error('加载账户失败 账户不存在');
    }
    const {
      type,
      defaultRepositoryId,
      imageHosting: imageHostingId,
      ...info
    } = account;
    const documentService = documentServiceFactory(type, info);
    const repositories = yield call(documentService.getRepositories);
    backend.setDocumentService(documentService);
    let currentImageHostingService: ClipperStore['currentImageHostingService'];
    if (imageHostingId) {
      const imageHostingIndex = imageHosting.findIndex(
        o => o.id === imageHostingId
      );
      if (imageHostingIndex !== -1) {
        const accountImageHosting = imageHosting[imageHostingIndex];
        const imageHostingService = imageHostingServiceFactory(
          accountImageHosting.type,
          accountImageHosting.info
        );
        backend.setImageHostingService(imageHostingService);
        currentImageHostingService = {
          type: accountImageHosting.type,
        };
      }
    }
    yield delay(1000);
    yield put(
      asyncChangeAccount.done({
        params: action.payload,
        result: {
          repositories,
          currentImageHostingService,
        },
      })
    );
  }
}

export function* watchAsyncChangeAccountSaga() {
  yield takeEvery(asyncChangeAccount.started.type, asyncChangeAccountSaga);
}
