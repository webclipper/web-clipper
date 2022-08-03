import { ServiceMeta } from '@/common/backend';
import Service from './service';

export const flowusOrigin = 'https://flowus.cn';

export default (): ServiceMeta => {
  return {
    name: 'FlowUs息流',
    icon: 'https://cdn.flowus.cn/icon.png',
    type: 'flowus',
    homePage: 'https://flowus.cn/',
    service: Service,
    permission: {
      origins: [`${flowusOrigin}/*`],
      permissions: ['cookies', 'webRequest', 'webRequestBlocking'],
    },
  };
};
