import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('version');

export const asyncFetchLatestVersion = actionCreator.async<void, string>('asyncFetchLatestVersion');
