import { SerializedExtensionWithId } from '@web-clipper/extensions';
import { actionCreatorFactory } from 'dva-model-creator';

const actionCreator = actionCreatorFactory('extension');

export const loadExtensions = actionCreator.async<
  void,
  {
    extensions: SerializedExtensionWithId[];
  }
>('loadExtensions');
