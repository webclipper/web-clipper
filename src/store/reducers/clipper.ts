import { asyncPostInitializeForm } from './../actions/userPreference';
import {
  cancelCreateRepository,
  changeCreateRepositoryTitle,
  asyncCreateRepository,
  initTabInfo,
  updateTextClipperData,
  asyncCreateDocument
} from './../actions/clipper';
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import {
  asyncFetchRepository,
  updateTitle,
  startCreateRepository,
  selectRepository,
  asyncRunPlugin
} from '../actions/clipper';
import update from 'immutability-helper';

const defaultState: ClipperStore = {
  title: '',
  repositories: [],
  clipperData: {},
  selectRepository: {
    createMode: false,
    repositoryTitle: '',
    creating: false
  }
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
  } else if (isType(action, startCreateRepository)) {
    return update(state, {
      selectRepository: {
        $set: {
          createMode: true,
          repositoryTitle: '',
          creating: false
        }
      }
    });
  } else if (isType(action, cancelCreateRepository)) {
    return update(state, {
      selectRepository: {
        $set: {
          createMode: false,
          repositoryTitle: '',
          creating: false
        }
      }
    });
  } else if (isType(action, changeCreateRepositoryTitle)) {
    const title = action.payload.repositoryTitle;
    return update(state, {
      selectRepository: {
        repositoryTitle: {
          $set: title
        }
      }
    });
  } else if (isType(action, asyncCreateRepository.started)) {
    return update(state, {
      selectRepository: {
        creating: {
          $set: true
        }
      }
    });
  } else if (isType(action, asyncCreateRepository.failed)) {
    return update(state, {
      selectRepository: {
        creating: {
          $set: false
        }
      }
    });
  } else if (isType(action, asyncCreateRepository.done)) {
    return update(state, {
      selectRepository: {
        $set: {
          createMode: false,
          repositoryTitle: '',
          creating: false
        }
      }
    });
  } else if (isType(action, selectRepository)) {
    const currentRepository = state.repositories.find(
      (o: Repository) => o.id === action.payload.repositoryId
    );
    return update(state, {
      currentRepository: {
        $set: currentRepository
      }
    });
  } else if (isType(action, asyncPostInitializeForm.done)) {
    return update(state, {
      repositories: {
        $set: action.payload.result.repositories
      }
    });
  } else if (isType(action, initTabInfo)) {
    return update(state, {
      url: {
        $set: action.payload.url
      },
      title: {
        $set: action.payload.title
      }
    });
  } else if (isType(action, updateTextClipperData)) {
    return update(state, {
      clipperData: {
        [action.payload.path]: {
          $set: action.payload.data
        }
      }
    });
  } else if (isType(action, asyncCreateDocument.done)) {
    return update(state, {
      completeStatus: {
        $set: {
          documentHref: action.payload.result.documentHref
        }
      }
    });
  } else if (isType(action, asyncRunPlugin.done)) {
    return update(state, {
      clipperData: {
        [action.payload.params.plugin.router]: {
          $set: {
            type: 'text',
            data: action.payload.result.result
          }
        }
      }
    });
  }
  return state;
}
