import { useMemo } from 'react';
import { SerializedExtensionWithId, ExtensionType } from '@web-clipper/extensions';

const useFilterExtensions = (extensions: SerializedExtensionWithId[]) => {
  return useMemo(() => {
    const toolExtensions: SerializedExtensionWithId[] = [];
    const clipExtensions: SerializedExtensionWithId[] = [];
    extensions.forEach(o => {
      if (o.type === ExtensionType.Tool) {
        toolExtensions.push(o);
        return;
      }
      clipExtensions.push(o);
    });
    return [toolExtensions, clipExtensions];
  }, [extensions]);
};

export default useFilterExtensions;
