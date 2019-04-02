import { SerializedExtensionWithId } from './interface';

const context = require.context('./extensions', true, /\.[t|j]s$/);

export const extensions: SerializedExtensionWithId[] = context
  .keys()
  .map(key => ({
    ...context(key).default.serialize(),
    id: key.slice(2, key.length - 3),
    router: '/plugins/' + key.slice(2, key.length - 3),
  }));

export default context;
