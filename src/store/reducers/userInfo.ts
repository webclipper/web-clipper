import { isType } from 'typescript-fsa';
import { Action } from 'redux';
import { asyncFetchUserInfo } from '../actions/userInfo';

import update from 'immutability-helper';

const defaultState: UserInfoStore = {};

export function userInfo(
  state: UserInfoStore = defaultState,
  action: Action
): UserInfoStore {
  if (isType(action, asyncFetchUserInfo.done)) {
    const { userInfo } = action.payload.result;
    return update(state, {
      $set: userInfo
    });
  }
  return state;
}
