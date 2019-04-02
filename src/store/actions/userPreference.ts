import { Repository, UserInfo } from './../../common/backend/index';
import { SerializedExtensionWithId } from '../../extensions/interface';
import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory('USER_PREFERENCE');

export const initUserPreference = actionCreator<PreferenceStorage>(
  'INIT_USER_PREFERENCE'
);

export const updateCreateAccountForm = actionCreator<
  Pick<InitializeForm, 'info' | 'type' | 'defaultRepositoryId'>
>('UPDATE_CREATE_ACCOUNT_FORM');

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
  void,
  {
    accounts: AccountPreference[];
    defaultAccountId: string;
  },
  void
>('ASYNC_ADD_ACCOUNT');

export const cancelCreateAccount = actionCreator('CANCEL_CREATE_ACCOUNT');

export const startCreateAccount = actionCreator('START_CREATE_ACCOUNT');

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

export const asyncHideTool = actionCreator.async<void, void, void>(
  'ASYNC_HIDE_TOOL'
);

export const asyncRemoveTool = actionCreator.async<void, void, void>(
  'ASYNC_REMOVE_TOOL'
);

export const asyncSetShowQuickResponseCode = actionCreator.async<
  {
    value: boolean;
  },
  {
    value: boolean;
  },
  void
>('ASYNC_SET_SHOW_QUICK_RESPONSE_CODE');

export const asyncSetDefaultPluginId = actionCreator.async<
  {
    pluginId: string | null;
  },
  void,
  void
>('ASYNC_SET_DEFAULT_PLUGIN_ID');

export const asyncRunExtension = actionCreator.async<
  {
    extension: SerializedExtensionWithId;
  },
  {
    result: any;
    pathname: string;
  },
  void
>('ASYNC_RUN_EXTENSION');

export const asyncRunScript = actionCreator.async<string, void, void>(
  'ASYNC_RUN_SCRIPT'
);
