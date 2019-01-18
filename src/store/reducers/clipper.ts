import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import { asyncFetchRepository, updateTitle } from '../actions/clipper';
import update from 'immutability-helper';

const defaultState: ClipperStore = {
  title: '',
  repositories: []
};

export default function clipper(
  state: ClipperStore = defaultState,
  action: Action
): ClipperStore {
  if (isType(action, asyncFetchRepository.done)) {
    const { repositories } = action.payload.result;
    return update(state, {
      repositories: {
        $set: repositories
      }
    });
  } else if (isType(action, updateTitle)) {
    return update(state, {
      title: {
        $set: action.payload.title
      }
    });
  }

  return state;
}
