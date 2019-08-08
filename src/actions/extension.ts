import { SerializedExtensionWithId } from '@web-clipper/extensions';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('extension');

export const loadExtensions = actionCreator<SerializedExtensionWithId[]>('loadExtensions');

export const setDefaultExtensionId = actionCreator.async<string, void>('setDefaultExtensionId');
