import { Action } from 'redux';

const defaultState: UserInfoStore = {};

export function userPreference(
  state = defaultState,
  _action: Action
): UserInfoStore {
  return state;
}
