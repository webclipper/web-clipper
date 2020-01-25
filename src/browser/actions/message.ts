import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('message');

export const removeTool = actionCreator('REMOVE_TOOL');

export const runScript = actionCreator<string>('RUN_SCRIPT');
