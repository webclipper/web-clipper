import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

import { USER_PREFERENCE } from './actionTypes';

export const initUserPreference = actionCreator<{
userPreferenceStore: Partial<UserPreferenceStore>;
}>(USER_PREFERENCE.INIT_USER_PREFERENCE);

export const updateInitializeForm = actionCreator<InitializeForm>(
  USER_PREFERENCE.UPDATE_INITIALIZE_FORM
);

export const asyncPostInitializeForm = actionCreator.async<
void,
{ repositories: Repository[]; userInfo: UserInfo },
{
error: Error;
}
>(USER_PREFERENCE.ASYNC_POST_INITIALIZE_FORM);

export const asyncChangeDefaultRepository = actionCreator.async<
{
defaultRepositoryId: string;
},
void
>(USER_PREFERENCE.ASYNC_CHANGE_DEFAULT_REPOSITORY);
