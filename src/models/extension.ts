import { GlobalStore } from '@/common/types';
import { DvaModelBuilder, removeActionNamespace } from 'dva-model-creator';
import { loadExtensions } from '@/actions/extension';
import { extensions } from 'extensions/index';

const initStore: GlobalStore['extension'] = {
  extensions: [],
};

const builder = new DvaModelBuilder(initStore, 'extension').case(
  loadExtensions,
  (state, extensions) => ({
    ...state,
    extensions,
  })
);

builder.subscript(({ dispatch }) => {
  dispatch(removeActionNamespace(loadExtensions(extensions)));
});

export default builder.build();
