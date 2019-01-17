import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

import { USER_PREFERENCE } from './actionTypes';

export const initUserPreference = actionCreator<{
userPreferenceStore: Partial<UserPreferenceStore>;
}>(USER_PREFERENCE.INIT_USER_PREFERENCE);
