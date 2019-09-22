import { useMemo } from 'react';
import { ExtensionType, SerializedExtensionInfo } from '@web-clipper/extensions';

const useFilterExtensions = <T extends SerializedExtensionInfo>(extensions: T[]) => {
  return useMemo(() => {
    const toolExtensions: T[] = [];
    const clipExtensions: T[] = [];
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
