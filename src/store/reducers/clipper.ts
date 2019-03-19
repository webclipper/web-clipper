import { asyncRunToolPlugin } from './../actions/clipper';
/* eslint-disable complexity */
import { Action } from 'redux';
import { isType } from 'typescript-fsa';
import {
  asyncFetchRepository,
  updateTitle,
  selectRepository,
  asyncRunPlugin,
  initTabInfo,
  updateTextClipperData,
  asyncCreateDocument,
  asyncChangeAccount,
  asyncTakeScreenshot,
} from '../actions/clipper';
import { initUserPreference } from '../actions/userPreference';
import update from 'immutability-helper';

const defaultState: ClipperStore = {
  title: '',
  currentAccountId: '',
  repositories: [],
  clipperData: {},
  loadingRepositories: true,
  creatingDocument: false,
};

export default function clipper(
  state: ClipperStore = defaultState,
  action: Action
): ClipperStore {
  if (isType(action, asyncChangeAccount.started)) {
    return update(state, {
      loadingRepositories: {
        $set: true,
      },
    });
  }
  if (isType(action, asyncChangeAccount.done)) {
    return update(state, {
      loadingRepositories: {
        $set: false,
      },
      currentAccountId: {
        $set: action.payload.params.id,
      },
      repositories: {
        $set: action.payload.result.repositories,
      },
      currentRepository: {
        // eslint-disable-next-line no-undefined
        $set: undefined,
      },
    });
  }
  if (isType(action, initUserPreference)) {
    const { defaultAccountId } = action.payload;
    return update(state, {
      currentAccountId: {
        $set: defaultAccountId || '',
      },
    });
  }
  if (isType(action, asyncFetchRepository.failed)) {
    return update(state, {
      loadingRepositories: {
        $set: false,
      },
    });
  }
  if (isType(action, asyncFetchRepository.done)) {
    const { repositories } = action.payload.result;
    return update(state, {
      loadingRepositories: {
        $set: false,
      },
      repositories: {
        $set: repositories,
      },
    });
  } else if (isType(action, updateTitle)) {
    return update(state, {
      title: {
        $set: action.payload.title,
      },
    });
  } else if (isType(action, selectRepository)) {
    const currentRepository = state.repositories.find(
      (o: Repository) => o.id === action.payload.repositoryId
    );
    return update(state, {
      currentRepository: {
        $set: currentRepository,
      },
    });
  } else if (isType(action, initTabInfo)) {
    return update(state, {
      url: {
        $set: action.payload.url,
      },
      title: {
        $set: action.payload.title,
      },
    });
  } else if (isType(action, updateTextClipperData)) {
    return update(state, {
      clipperData: {
        [action.payload.path]: {
          $set: action.payload.data,
        },
      },
    });
  } else if (isType(action, asyncCreateDocument.started)) {
    return update(state, {
      creatingDocument: {
        $set: true,
      },
    });
  } else if (isType(action, asyncCreateDocument.failed)) {
    return update(state, {
      creatingDocument: {
        $set: false,
      },
    });
  } else if (isType(action, asyncCreateDocument.done)) {
    return update(state, {
      creatingDocument: {
        $set: false,
      },
      completeStatus: {
        $set: action.payload.result,
      },
    });
  } else if (isType(action, asyncRunPlugin.done)) {
    return update(state, {
      clipperData: {
        [action.payload.params.pathname]: {
          $set: {
            type: 'text',
            data: action.payload.result.result,
          },
        },
      },
    });
  } else if (isType(action, asyncTakeScreenshot.done)) {
    return update(state, {
      clipperData: {
        [action.payload.params.pathname]: {
          $set: {
            type: 'image',
            ...action.payload.result,
          },
        },
      },
    });
  } else if (isType(action, asyncRunToolPlugin.done)) {
    return update(state, {
      clipperData: {
        [action.payload.result.pathname]: {
          $set: {
            type: 'text',
            data: action.payload.result.result,
          },
        },
      },
    });
  }
  return state;
}
