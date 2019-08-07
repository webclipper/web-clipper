import { CompleteStatus } from 'common/backend/interface';
import { ExtensionType } from '@web-clipper/extensions';
import { CreateDocumentRequest } from './../common/backend/services/interface';
import { GlobalStore, ImageClipperData, ClipperStore } from '@/common/types';
import { DvaModelBuilder } from 'dva-model-creator';
import update from 'immutability-helper';
import {
  updateTitle,
  selectRepository,
  initTabInfo,
  asyncCreateDocument,
  asyncChangeAccount,
  changeData,
} from 'pageActions/clipper';
import backend, { documentServiceFactory, imageHostingServiceFactory } from 'common/backend';
import { message } from 'antd';
import { routerRedux } from 'dva';

const defaultState: ClipperStore = {
  title: '',
  currentAccountId: '',
  repositories: [],
  clipperData: {},
};
const model = new DvaModelBuilder(defaultState, 'clipper')
  .takeEveryWithAction(asyncChangeAccount.started, function*(
    { payload, payload: { id } },
    { call, select, put }
  ) {
    const selector = ({ userPreference: { accounts, imageHosting } }: GlobalStore) => {
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
    const { type, defaultRepositoryId, imageHosting: imageHostingId, ...info } = account;
    const documentService = documentServiceFactory(type, info);
    const repositories = yield call(documentService.getRepositories);
    backend.setDocumentService(documentService);
    let currentImageHostingService: ClipperStore['currentImageHostingService'];
    if (imageHostingId) {
      const imageHostingIndex = imageHosting.findIndex(o => o.id === imageHostingId);
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
  .takeLatest(asyncCreateDocument.started, function*({ pathname }, { put, call, select }) {
    const selector = ({
      clipper: { currentRepository, clipperData, title, repositories, currentAccountId },
      userPreference: { accounts },
      extension: { extensions },
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
      const extension = extensions.find(o => `/plugins/${o.id}` === pathname);
      const data = clipperData[pathname];
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
      yield put(
        asyncCreateDocument.failed({
          params: { pathname },
          error: null,
        })
      );
      message.error('必须选择一个知识库');
      return;
    }
    if (!title) {
      yield put(asyncCreateDocument.failed({ params: { pathname }, error: null }));
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
        const responseUrl: string = yield call(imageHostingService.uploadImage, {
          data: (data as ImageClipperData).dataUrl,
        });
        createDocumentRequest = {
          title: title,
          repositoryId,
          content: `![](${responseUrl})`,
        };
      } catch (_error) {
        message.error('上传图片到图床失败');
        yield put(asyncCreateDocument.failed({ params: { pathname }, error: null }));
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
        params: { pathname },
        result: response,
      })
    );
    yield put(routerRedux.push('/complete'));
  })
  .case(
    asyncChangeAccount.done,
    (state, { params: { id }, result: { repositories, currentImageHostingService } }) => {
      return update(state, {
        currentAccountId: {
          $set: id,
        },
        repositories: {
          $set: repositories,
        },
        currentRepository: {
          // eslint-disable-next-line no-undefined
          $set: undefined,
        },
        currentImageHostingService: {
          $set: currentImageHostingService,
        },
      });
    }
  )
  .case(updateTitle, (state, { title }) => ({
    ...state,
    title,
  }))
  .case(selectRepository, (state, { repositoryId }) => {
    const currentRepository = state.repositories.find(o => o.id === repositoryId);
    return {
      ...state,
      currentRepository,
    };
  })
  .case(initTabInfo, (state, { title, url }) => ({
    ...state,
    title,
    url,
  }))
  .case(asyncCreateDocument.started, state => ({
    ...state,
  }))
  .case(asyncCreateDocument.done, (state, { result: completeStatus }) => ({
    ...state,
    completeStatus,
  }))
  .case(changeData, (state, { data, pathName }) =>
    update(state, {
      clipperData: {
        [pathName]: {
          $set: data,
        },
      },
    })
  );

export default model.build();
