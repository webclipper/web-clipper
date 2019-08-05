import { SerializedExtensionWithId } from '@web-clipper/extensions';

const context = require.context('./extensions', true, /\.[t|j]s$/);

export const extensions: SerializedExtensionWithId[] = context.keys().map(key => ({
  ...context(key).default.serialize(),
  id: key.slice(2, key.length - 3).replace('/', '_'),
  router: `/plugins/${key.slice(2, key.length - 3).replace('/', '_')}`,
}));

export default context;
