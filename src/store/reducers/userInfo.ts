import update from 'immutability-helper';
import { Action } from 'redux';
import { asyncFetchUserInfo } from '../actions/userInfo';
import { isType } from 'typescript-fsa';

const defaultState: UserInfoStore = {};

export function userInfo(
  state: UserInfoStore = defaultState,
  action: Action
): UserInfoStore {
  if (isType(action, asyncFetchUserInfo.done)) {
    const { userInfo } = action.payload.result;
    return update(state, {
      $set: userInfo,
    });
  }
  return state;
}
