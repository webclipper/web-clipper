import { Action } from 'redux';
const defaultState: ClipperStore = {
  title: '',
  repositories: []
};

export function clipper(state = defaultState, _action: Action): ClipperStore {
  return state;
}
