import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

import { USER_PREFERENCE } from './actionTypes';

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
{ accessToken: string },
{
accounts: AccountPreference[];
},
void
>(USER_PREFERENCE.ASYNC_DELETE_ACCOUNT);

export const asyncUpdateCurrentAccountIndex = actionCreator.async<
{ accessToken: string },
{
index: number;
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
