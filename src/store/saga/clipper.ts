import backend, { documentServiceFactory } from '../../services/backend';
import browserService from '../../services/browser';
import { AnyAction, isType } from 'typescript-fsa';
import {
  asyncChangeAccount,
  asyncCreateDocument,
  asyncCreateRepository,
  asyncFetchRepository,
  asyncRunPlugin,
  asyncTakeScreenshot,
  asyncRunToolPlugin,
} from '../actions/clipper';
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
import { push } from 'connected-react-router';
import { SelectAreaPosition } from '../../services/common/areaSelector';
import { loadImage } from '../../services/utils/bolb';

export function* clipperRootSagas() {
  yield fork(watchAsyncRunPluginSaga);
  yield fork(watchAsyncCreateRepositorySaga);
  yield fork(watchAsyncFetchRepositorySaga);
  yield fork(watchAsyncCreateDocumentSaga);
  yield fork(watchAsyncChangeAccountSaga);
  yield fork(watchAsyncTakeScreenshotSaga);
  yield fork(watchAsyncRunToolPluginSaga);
}

export function* asyncFetchRepositorySaga() {
  try {
    const response: Repository[] = yield call(
      backend.getDocumentService().getRepositories
    );
    yield put(
      asyncFetchRepository.done({
        result: {
          repositories: response,
        },
      })
    );
  } catch (error) {
    yield put(
      asyncFetchRepository.failed({
        error: error,
      })
    );
  }
}

export function* asyncCreateDocumentSaga() {
  const selector = ({
    clipper,
    router,
    userPreference: { accounts },
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
    };
  };

  const selectState: ReturnType<typeof selector> = yield select(selector);
  const {
    currentRepository,
    defaultRepositoryId,
    title,
    router,
    clipperData,
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
  if (!data) {
    yield put(
      asyncCreateDocument.failed({
        error: null,
      })
    );
    message.error('no data');
    return;
  }
  let createDocumentRequest;
  if (data.type === 'text') {
    createDocumentRequest = {
      title: title,
      private: true,
      repositoryId,
      content: data.data,
    };
  }
  if (data.type === 'image') {
    try {
      const responseUrl: string = yield call(
        backend.getImageHostingService().uploadImage,
        {
          data: data.dataUrl,
        }
      );
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
  const response: CreateDocumentResponse = yield call(
    backend.getDocumentService().createDocument,
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

export function* asyncCreateRepositorySaga() {
  try {
    const title = yield select((state: GlobalStore) => {
      return state.clipper.selectRepository.repositoryTitle;
    });
    yield call(backend.getDocumentService().createRepository, {
      name: title,
      private: true,
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
    const result: string = yield call(
      browserService.sendActionToCurrentTab,
      action
    );
    yield put(
      asyncRunPlugin.done({
        params: action.payload,
        result: { result },
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
        accounts,
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
      type: account.type,
    });
    const repositories = yield call(documentService.getRepositories);
    backend.setDocumentService(documentService);
    yield delay(1000);
    yield put(
      asyncChangeAccount.done({
        params: {
          id,
        },
        result: {
          repositories,
        },
      })
    );
  }
}

export function* watchAsyncChangeAccountSaga() {
  yield takeEvery(asyncChangeAccount.started.type, asyncChangeAccountSaga);
}

export function* asyncTakeScreenshotSaga(action: AnyAction) {
  if (isType(action, asyncTakeScreenshot.started)) {
    const selectArea: SelectAreaPosition = yield call(
      browserService.sendActionToCurrentTab,
      action
    );
    const base64Capture = yield call(browserService.captureVisibleTab);
    const img = yield call(loadImage, base64Capture);
    let canvas: HTMLCanvasElement = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let sx;
    let sy;
    let sheight;
    let swidth;
    let {
      rightBottom: { clientX: rightBottomX, clientY: rightBottomY },
      leftTop: { clientX: leftTopX, clientY: leftTopY },
    } = selectArea;
    if (rightBottomX === leftTopX && rightBottomY === leftTopY) {
      sx = 0;
      sy = 0;
      swidth = img.width;
      sheight = img.height;
    } else {
      const dpi = img.width / document.body.clientWidth;
      sx = leftTopX * dpi;
      sy = leftTopY * dpi;
      swidth = (rightBottomX - leftTopX) * dpi;
      sheight = (rightBottomY - leftTopY) * dpi;
    }
    canvas.height = sheight;
    canvas.width = swidth;
    ctx!.drawImage(img, sx, sy, swidth, sheight, 0, 0, swidth, sheight);
    const doneAction = asyncTakeScreenshot.done({
      params: action.payload,
      result: {
        dataUrl: canvas.toDataURL(),
        width: swidth,
        height: sheight,
      },
    });
    yield put(doneAction);
    yield call(browserService.sendActionToCurrentTab, doneAction);
  }
}

export function* watchAsyncTakeScreenshotSaga() {
  yield takeEvery(asyncTakeScreenshot.started.type, asyncTakeScreenshotSaga);
}

export function* asyncRunToolPluginSaga(action: AnyAction) {
  if (isType(action, asyncRunToolPlugin.started)) {
    const result: string = yield call(
      browserService.sendActionToCurrentTab,
      action
    );

    const selector = (state: GlobalStore) => {
      const pathname = state.router.location.pathname;
      const data = state.clipper.clipperData[pathname];
      return {
        data,
        pathname,
      };
    };

    const { data, pathname }: ReturnType<typeof selector> = yield select(
      selector
    );

    if (action.payload.plugin.processingDocuments && data) {
      const response: string = yield (async () => {
        // @ts-ignore
        // eslint-disable-next-line
        const context: PagePluginContext = {
          previous: result,
          currentData: (data as TextClipperData).data,
          imageService: backend.getImageHostingService(),
          message,
        };
        // eslint-disable-next-line
        return await eval(action.payload.plugin.processingDocuments!);
      })();
      yield put(
        asyncRunToolPlugin.done({
          params: action.payload,
          result: {
            result: response,
            pathname,
          },
        })
      );
    }
  }
}

export function* watchAsyncRunToolPluginSaga() {
  yield takeEvery(asyncRunToolPlugin.started.type, asyncRunToolPluginSaga);
}
