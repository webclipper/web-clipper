import { AccountPreference, ImageHosting } from '@/common/types';
import { PreferenceStorage } from 'common/storage/interface';
import { Repository, UserInfo } from 'common/backend/index';
import { SerializedExtensionWithId } from '@/extensions/interface';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('userPreference');

export const initUserPreference = actionCreator<PreferenceStorage>('INIT_USER_PREFERENCE');

export const asyncVerificationAccessToken = actionCreator.async<
  {
    type: string;
    info: any;
  },
  { repositories: Repository[]; userInfo: UserInfo },
  {
    cancel?: boolean;
    error?: Error;
  }
>('ASYNC_VERIFICATION_ACCESS_TOKEN');

export const asyncChangeDefaultRepository = actionCreator.async<
  {
    defaultRepositoryId: string;
  },
  void
>('ASYNC_CHANGE_DEFAULT_REPOSITORY');

export const asyncAddAccount = actionCreator.async<
  {
    info: any;
    imageHosting?: string;
    defaultRepositoryId?: string;
    type: string;
    callback(): void;
  },
  {
    accounts: AccountPreference[];
    defaultAccountId: string;
  },
  void
>('ASYNC_ADD_ACCOUNT');

export const asyncUpdateAccount = actionCreator.async<
  {
    id: string;
    account: {
      info: any;
      imageHosting?: string;
      defaultRepositoryId?: string;
      type: string;
    };
    callback(): void;
  },
  {
    accounts: AccountPreference[];
  },
  void
>('ASYNC_UPDATE_ACCOUNT');

export const cancelCreateAccount = actionCreator('CANCEL_CREATE_ACCOUNT');

export const asyncDeleteAccount = actionCreator.async<
  { id: string },
  {
    accounts: AccountPreference[];
    defaultAccountId: string;
  },
  void
>('ASYNC_DELETE_ACCOUNT');

export const asyncUpdateCurrentAccountIndex = actionCreator.async<
  { id: string },
  {
    id: string;
  },
  void
>('ASYNC_UPDATE_CURRENT_ACCOUNT_INDEX');

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

export const asyncSetDefaultPluginId = actionCreator.async<
  {
    pluginId: string | null;
  },
  void,
  void
>('ASYNC_SET_DEFAULT_PLUGIN_ID');

export const asyncRunExtension = actionCreator.async<
  {
    pathname: string;
    extension: SerializedExtensionWithId;
  },
  {
    result: any;
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

export const resetAccountForm = actionCreator('RESET_ACCOUNT_FORM');

export const setRemoteVersion = actionCreator<string>('SET_REMOTE_VERSION');
