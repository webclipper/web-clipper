import { ImageHosting, GlobalStore, IUserInfo } from '@/common/types';
import { PreferenceStorage } from 'common/storage/interface';
import { SerializedExtensionWithId } from '@web-clipper/extensions';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('userPreference');

export const initUserPreference = actionCreator<PreferenceStorage>('INIT_USER_PREFERENCE');

export const asyncChangeDefaultRepository = actionCreator.async<
  {
    defaultRepositoryId: string;
  },
  void
>('ASYNC_CHANGE_DEFAULT_REPOSITORY');

export const asyncSetEditorLiveRendering = actionCreator.async<
  {
    value: boolean;
  },
  {
    value: boolean;
  },
  void
>('ASYNC_SET_EDITOR_LIVE_RENDERING');

export const asyncSetShowLineNumber = actionCreator.async<
  {
    value: boolean;
  },
  {
    value: boolean;
  },
  void
>('ASYNC_SET_SHOW_LINE_NUMBER');

export const asyncHideTool = actionCreator.async<void, void, void>('ASYNC_HIDE_TOOL');

export const asyncRemoveTool = actionCreator.async<void, void, void>('ASYNC_REMOVE_TOOL');

export const asyncRunExtension = actionCreator.async<
  {
    pathname: string;
    extension: SerializedExtensionWithId;
  },
  {
    result: unknown;
    pathname: string;
  },
  void
>('ASYNC_RUN_EXTENSION');

export const asyncRunScript = actionCreator.async<string, void, void>('ASYNC_RUN_SCRIPT');

export const asyncAddImageHosting = actionCreator.async<
  { closeModal: () => void } & Omit<ImageHosting, 'id'>,
  ImageHosting[],
  void
>('ASYNC_ADD_IMAGE_HOSTING');

export const asyncDeleteImageHosting = actionCreator.async<{ id: string }, ImageHosting[], void>(
  'ASYNC_DELETE_IMAGE_HOSTING'
);

export const asyncEditImageHosting = actionCreator.async<
  { id: string; value: Omit<ImageHosting, 'id'>; closeModal: () => void },
  ImageHosting[],
  void
>('ASYNC_EDIT_IMAGE_HOSTING');

export const setLocale = actionCreator<string>('setLocale');
export const asyncSetLocaleToStorage = actionCreator<string>('asyncSetLocaleToStorage');

export const initServices = actionCreator<
  Pick<GlobalStore['userPreference'], 'servicesMeta' | 'imageHostingServicesMeta'>
>('initServices');

export const loginWithToken = actionCreator<string>('loginWithToken');

export const initPowerpack = actionCreator.async<
  void,
  {
    userInfo: IUserInfo | null;
    accessToken?: string;
  }
>('initPowerpack');
