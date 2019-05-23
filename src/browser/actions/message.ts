import actionCreatorFactory from 'common/typescript-fsa';
const actionCreator = actionCreatorFactory('message');

export const removeTool = actionCreator('REMOVE_TOOL');

export const runScript = actionCreator<string>('RUN_SCRIPT');

export const hideTool = actionCreator('HIDE_TOOL');
