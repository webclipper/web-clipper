import { updateClipperHeader } from './../actions/clipper';
import { asyncRunExtension } from './../actions/userPreference';
import { CompleteStatus } from 'common/backend/interface';
import { ExtensionType } from '@web-clipper/extensions';
import { CreateDocumentRequest, UnauthorizedError } from './../common/backend/services/interface';
import { GlobalStore, ImageClipperData, ClipperStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import update from 'immutability-helper';
import {
  selectRepository,
  initTabInfo,
  asyncCreateDocument,
  asyncChangeAccount,
  changeData,
  watchActionChannel,
} from 'pageActions/clipper';
import backend, { documentServiceFactory, imageHostingServiceFactory } from 'common/backend';
import { unpackAccountPreference } from '@/common/account';
import { message } from 'antd';
import { routerRedux } from 'dva';
import { asyncUpdateAccount } from '@/actions/account';
import { channel } from 'redux-saga';

const defaultState: ClipperStore = {
  clipperHeaderForm: {
    title: '',
  },
  currentAccountId: '',
  repositories: [],
  clipperData: {},
};

const actionChannel = channel();

const model = new DvaModelBuilder(defaultState, 'clipper')
  .subscript(function startWatchActionChannel({ dispatch }) {
    dispatch(removeActionNamespace(watchActionChannel()));
  })
  .takeEvery(watchActionChannel, function*(_, { put, take }) {
    while (true) {
      const action = yield take(actionChannel);
      yield put(action);
    }
  })
  .takeEvery(asyncChangeAccount.started, function*(payload, { call, select, put }) {
    const selector = ({ userPreference: { imageHosting }, account: { accounts } }: GlobalStore) => {
      return {
        accounts,
        imageHosting,
      };
    };
    const selectState: ReturnType<typeof selector> = yield select(selector);
    const { accounts, imageHosting } = selectState;
    const currentAccount = accounts.find(o => o.id === payload.id);
    if (!currentAccount) {
      throw new Error('Load Account Error,Account not exist.');
    }
    const {
      id,
      account,
      account: { type, info },
      userInfo,
    } = unpackAccountPreference(currentAccount);
    const documentService = documentServiceFactory(type, info);
    let repositories = [];
    try {
      repositories = yield call(documentService.getRepositories);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        if (documentService.refreshToken) {
          const newInfo = yield call(documentService.refreshToken, info);
          yield put(
            asyncUpdateAccount({
              id,
              account: {
                ...account,
                info: newInfo,
              },
              userInfo,
              newId: id,
              callback: () => {
                actionChannel.put(asyncChangeAccount.started({ id }));
              },
            })
          );
          return;
        }
        throw new Error('Filed to load Repositories,Unauthorized.');
      } else {
        throw error;
      }
    }
    backend.setDocumentService(documentService);
    let currentImageHostingService: ClipperStore['currentImageHostingService'];
    if (account.imageHosting) {
      const imageHostingIndex = imageHosting.findIndex(o => o.id === account.imageHosting);
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
      clipper: { currentRepository, clipperHeaderForm, repositories, currentAccountId },
      account: { accounts },
      extension: { extensions, disabledAutomaticExtensions },
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
      const extension = extensions.find(o => o.router === pathname);
      const automaticExtensions = extensions.filter(
        o =>
          o.type === ExtensionType.Tool &&
          o.manifest.automatic &&
          disabledAutomaticExtensions.every(id => id !== o.id)
      );
      return {
        repositoryId,
        extensions,
        clipperHeaderForm,
        extension,
        repositories,
        automaticExtensions,
      };
    };
    const {
      repositoryId,
      clipperHeaderForm,
      extension,
      automaticExtensions,
    }: ReturnType<typeof selector> = yield select(selector);
    if (!repositoryId) {
      yield put(
        asyncCreateDocument.failed({
          params: { pathname },
          error: null,
        })
      );
      throw new Error('Must select repository.');
    }
    if (!extension) {
      return;
    }
    if (extension.type === ExtensionType.Text) {
      for (const iterator of automaticExtensions) {
        yield put.resolve(asyncRunExtension.started({ pathname, extension: iterator }));
      }
    }
    const data = yield select((g: GlobalStore) => g.clipper.clipperData[pathname]);
    let createDocumentRequest: CreateDocumentRequest | null = null;
    if (extension.type === ExtensionType.Text) {
      createDocumentRequest = {
        repositoryId,
        content: data as string,
        ...clipperHeaderForm,
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
          repositoryId,
          content: `![](${responseUrl})`,
          ...clipperHeaderForm,
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
        result: {
          result: response,
          request: createDocumentRequest,
        },
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
  .case(selectRepository, (state, { repositoryId }) => {
    const currentRepository = state.repositories.find(o => o.id === repositoryId);
    return {
      ...state,
      currentRepository,
    };
  })
  .case(initTabInfo, (state, { title, url }) => ({
    ...state,
    clipperHeaderForm: {
      ...state.clipperHeaderForm,
      title,
    },
    url,
  }))
  .case(asyncCreateDocument.started, state => ({
    ...state,
  }))
  .case(
    asyncCreateDocument.done,
    (state, { result: { result: completeStatus, request: createDocumentRequest } }) => ({
      ...state,
      completeStatus,
      createDocumentRequest,
    })
  )
  .case(updateClipperHeader, (state, clipperHeaderForm) => ({
    ...state,
    clipperHeaderForm,
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
