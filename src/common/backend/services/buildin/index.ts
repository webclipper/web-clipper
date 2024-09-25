import { ServiceMeta } from '@/common/backend';
import Service from './service';

export const buildinOrigin = 'https://buildin.ai';

export default (): ServiceMeta => {
  return {
    name: 'Buildin.AI',
    icon: 'https://cdn.buildin.ai/s3-public/8ebf3bb6-08c9-40b1-93d5-6d5c5c2fe49c/logo.svg',
    type: 'buildin',
    homePage: 'https://buildin.ai/',
    service: Service,
    permission: {
      origins: [`${buildinOrigin}/*`, '<all_urls>'],
      permissions: ['cookies'],
    },
  };
};
