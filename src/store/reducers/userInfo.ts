import { Action } from 'redux';

const defaultState: UserInfoStore = {};

export function userInfo(state = defaultState, _action: Action): UserInfoStore {
  return state;
}
