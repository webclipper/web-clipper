import { ImageHostingServiceMeta } from '../backend';
import { ImageHosting } from '../modelTypes/userPreference';

interface Props {
  backendServiceType: string;
  imageHostingServices: ImageHosting[];
  imageHostingServicesMap: {
    [type: string]: ImageHostingServiceMeta;
  };
}

export type ImageHostingWithMeta = {
  imageHostingServices: ImageHosting;
  meta: ImageHostingServiceMeta;
};

const useFilterImageHostingServices = ({
  backendServiceType,
  imageHostingServices,
  imageHostingServicesMap,
}: Props) => {
  return imageHostingServices
    .map(o => {
      const meta = imageHostingServicesMap[o.type];
      if (!meta) {
        return null;
      }
      if (meta.builtIn && meta.type !== backendServiceType) {
        return null;
      }
      if (meta.support && !meta.support(backendServiceType)) {
        return null;
      }
      return { imageHostingServices: o, meta };
    })
    .filter((o): o is ImageHostingWithMeta => !!o);
};

export default useFilterImageHostingServices;
