import { SerializedExtensionWithId } from '@web-clipper/extensions';

const context = require.context('./extensions', true, /\.[t|j]s$/);

export const extensions: SerializedExtensionWithId[] = context.keys().map(key => {
  const id = key.slice(2, key.length - 3);
  return {
    ...context(key).default.serialize(),
    id,
    router: `/plugins/${id}`,
  };
});

export default context;
