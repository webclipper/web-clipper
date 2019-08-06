import { SerializedExtensionWithId } from '@web-clipper/extensions';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('extension');

export const loadInternalExtensions = actionCreator<SerializedExtensionWithId[]>(
  'loadInternalExtensions'
);
