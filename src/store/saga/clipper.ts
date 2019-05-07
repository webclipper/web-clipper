import { CompleteStatus } from './../../common/backend/services/interface';
import { ClipperStore } from './../reducers/clipper/interface';
import { GlobalStore } from './../reducers/interface';
import { ImageClipperData } from './../reducers/userPreference/interface';
import backend, {
  documentServiceFactory,
  imageHostingServiceFactory,
  CreateDocumentRequest,
} from 'common/backend';
import { asyncChangeAccount, asyncCreateDocument } from 'actions';
import { call, put, select, delay } from 'redux-saga/effects';
import { message } from 'antd';
import { ExtensionType } from '../../extensions/interface';
import { push } from 'connected-react-router';
import SagaHelper from 'common/sagaHelper';

export const clipperRootSagas = new SagaHelper()
  .takeEvery(asyncChangeAccount, function*({ payload, payload: { id } }) {
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
        params: payload,
        result: {
          repositories,
          currentImageHostingService,
        },
      })
    );
  })
  .takeLatest(asyncCreateDocument, function*() {
    const selector = ({
      clipper: {
        currentRepository,
        clipperData,
        title,
        repositories,
        currentAccountId,
      },
      router,
      userPreference: { accounts, extensions },
    }: GlobalStore) => {
      const currentAccount = accounts.find(({ id }) => id === currentAccountId);
      let repositoryId;
      if (
        currentAccount &&
        repositories.some(({ id }) => id === currentAccount.defaultRepositoryId)
      ) {
        repositoryId = currentAccount.defaultRepositoryId;
      }
      if (currentRepository) {
        repositoryId = currentRepository.id;
      }
      const extension = extensions.find(
        o => `/plugins/${o.id}` === router.location.pathname
      );
      const data = clipperData[router.location.pathname];
      return {
        repositoryId,
        data,
        title,
        extension,
        repositories,
      };
    };
    const selectState: ReturnType<typeof selector> = yield select(selector);
    const { repositoryId, title, data, extension } = selectState;
    if (!repositoryId) {
      yield put(asyncCreateDocument.failed({ error: null }));
      message.error('必须选择一个知识库');
      return;
    }
    if (!title) {
      yield put(asyncCreateDocument.failed({ error: null }));
      message.error('标题不允许为空');
      return;
    }
    if (!extension) {
      return;
    }
    let createDocumentRequest: CreateDocumentRequest | null = null;
    if (extension.type === ExtensionType.Text) {
      createDocumentRequest = {
        title: title,
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
        const responseUrl: string = yield call(
          imageHostingService.uploadImage,
          {
            data: (data as ImageClipperData).dataUrl,
          }
        );
        createDocumentRequest = {
          title: title,
          repositoryId,
          content: `![](${responseUrl})`,
        };
      } catch (_error) {
        message.error('上传图片到图床失败');
        yield put(asyncCreateDocument.failed({ error: null }));
        return;
      }
    }
    if (!createDocumentRequest) {
      return;
    }
    const response: CompleteStatus = yield call(
      backend.getDocumentService()!.createDocument,
      createDocumentRequest
    );
    yield put(
      asyncCreateDocument.done({
        result: response,
      })
    );
    yield put(push('/complete'));
  })
  .combine();
