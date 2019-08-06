import { GlobalStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import { loadInternalExtensions } from '@/actions/extension';
import { extensions } from 'extensions/index';

const initStore: GlobalStore['extension'] = {
  extensions: [],
};

const builder = new DvaModelBuilder(initStore, 'extension').case(
  loadInternalExtensions,
  (state, extensions) => ({
    ...state,
    extensions,
  })
);

builder.subscript(({ dispatch }) => {
  dispatch(removeActionNamespace(loadInternalExtensions(extensions)));
});

export default builder.build();
