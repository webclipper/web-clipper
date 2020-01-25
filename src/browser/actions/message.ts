import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('message');

export const runScript = actionCreator<string>('RUN_SCRIPT');
