import { SerializedExtensionWithId } from '@web-clipper/extensions';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('extension');

export const loadExtensions = actionCreator.async<
  void,
  {
    extensions: SerializedExtensionWithId[];
    disabledExtensions: string[];
  }
>('loadExtensions');

export const installRemoteExtension = actionCreator.async<SerializedExtensionWithId, void>(
  'installRemoteExtension'
);

export const setDefaultExtensionId = actionCreator.async<string, void>('setDefaultExtensionId');

export const toggleDisableExtension = actionCreator<string>('toggleDisableExtension');
