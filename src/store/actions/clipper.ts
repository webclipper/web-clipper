import { Repository, CompleteStatus } from 'common/backend/index';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('clipper');

export const updateTitle = actionCreator<{ title: string }>('UPDATE_TITLE');

export const asyncCreateDocument = actionCreator.async<void, CompleteStatus, null>(
  'ASYNC_CREATE_DOCUMENT'
);

export const asyncUploadImage = actionCreator.async<void, void, void>('ASYNC_UPLOAD_IMAGE');

export const selectRepository = actionCreator<{ repositoryId: string }>('SELECT_REPOSITORY');

export const initTabInfo = actionCreator<{ title: string; url: string }>('INIT_TAB_INFO');

export const asyncChangeAccount = actionCreator.async<
  {
    id: string;
  },
  {
    repositories: Repository[];
    currentImageHostingService?: { type: string };
  },
  any
>('ASYNC_CHANGE_ACCOUNT');

export const changeData = actionCreator<{ data: any; pathName: string }>('CHANGE_DATA');
