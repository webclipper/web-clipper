import { Repository, UserInfo } from './../../common/backend/index';
import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

import { USER_PREFERENCE } from './actionTypes';
import { SerializedExtensionWithId } from '../../extensions/interface';

export const initUserPreference = actionCreator<PreferenceStorage>(
  USER_PREFERENCE.INIT_USER_PREFERENCE
);

export const updateCreateAccountForm = actionCreator<InitializeForm>(
  USER_PREFERENCE.UPDATE_CREATE_ACCOUNT_FORM
);

export const asyncVerificationAccessToken = actionCreator.async<
  void,
  { repositories: Repository[]; userInfo: UserInfo },
  {
    cancel?: boolean;
    error?: Error;
  }
>(USER_PREFERENCE.ASYNC_VERIFICATION_ACCESS_TOKEN);

export const asyncChangeDefaultRepository = actionCreator.async<
  {
    defaultRepositoryId: string;
  },
  void
>(USER_PREFERENCE.ASYNC_CHANGE_DEFAULT_REPOSITORY);

export const asyncAddAccount = actionCreator.async<
  void,
  {
    accounts: AccountPreference[];
    defaultAccountId: string;
  },
  void
>(USER_PREFERENCE.ASYNC_ADD_ACCOUNT);

export const cancelCreateAccount = actionCreator(
  USER_PREFERENCE.CANCEL_CREATE_ACCOUNT
);

export const startCreateAccount = actionCreator(
  USER_PREFERENCE.START_CREATE_ACCOUNT
);

export const asyncDeleteAccount = actionCreator.async<
  { id: string },
  {
    accounts: AccountPreference[];
    defaultAccountId: string;
  },
  void
>(USER_PREFERENCE.ASYNC_DELETE_ACCOUNT);

export const asyncUpdateCurrentAccountIndex = actionCreator.async<
  { id: string },
  {
    id: string;
  },
  void
>(USER_PREFERENCE.ASYNC_UPDATE_CURRENT_ACCOUNT_INDEX);

export const asyncSetEditorLiveRendering = actionCreator.async<
  {
    value: boolean;
  },
  {
    value: boolean;
  },
  void
>(USER_PREFERENCE.ASYNC_SET_EDITOR_LIVE_RENDERING);

export const asyncSetShowLineNumber = actionCreator.async<
  {
    value: boolean;
  },
  {
    value: boolean;
  },
  void
>(USER_PREFERENCE.ASYNC_SET_SHOW_LINE_NUMBER);

export const asyncHideTool = actionCreator.async<void, void, void>(
  USER_PREFERENCE.ASYNC_HIDE_TOOL
);

export const asyncRemoveTool = actionCreator.async<void, void, void>(
  USER_PREFERENCE.ASYNC_REMOVE_TOOL
);

export const asyncSetShowQuickResponseCode = actionCreator.async<
  {
    value: boolean;
  },
  {
    value: boolean;
  },
  void
>(USER_PREFERENCE.ASYNC_SET_SHOW_QUICK_RESPONSE_CODE);

export const asyncSetDefaultPluginId = actionCreator.async<
  {
    pluginId: string | null;
  },
  void,
  void
>(USER_PREFERENCE.ASYNC_SET_DEFAULT_PLUGIN_ID);

export const asyncRunExtension = actionCreator.async<
  {
    extension: SerializedExtensionWithId;
  },
  {
    result: any;
    pathname: string;
  },
  void
>(USER_PREFERENCE.ASYNC_RUN_EXTENSION);

export const asyncRunScript = actionCreator.async<string, void, void>(
  USER_PREFERENCE.ASYNC_RUN_SCRIPT
);
