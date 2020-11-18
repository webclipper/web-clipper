import { ServiceMeta } from '@/common/backend';
import Service from './service';

export default (): ServiceMeta => {
  return {
    name: '我来',
    icon: 'https://static2.wolai.com/dist/favicon.ico',
    type: 'wolai',
    homePage: 'https://www.wolai.com/',
    service: Service,
    permission: {
      origins: ['https://api.wolai.com/*'],
      permissions: ['cookies', 'webRequest', 'webRequestBlocking'],
    },
  };
};
