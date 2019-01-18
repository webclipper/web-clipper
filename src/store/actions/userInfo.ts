import actionCreatorFactory from 'typescript-fsa';
const actionCreator = actionCreatorFactory();

import { USER_INFO } from './actionTypes';

export const asyncFetchUserInfo = actionCreator.async<
void,
{
userInfo: UserInfo;
},
void
>(USER_INFO.ASYNC_FETCH_USER_INFO);
