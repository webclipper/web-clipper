import { ServiceMeta } from '@/common/backend';
import Service from './service';

export default (): ServiceMeta => {
  return {
    name: 'Notion',
    icon: 'https://www.notion.so/images/favicon.ico',
    type: 'notion',
    homePage: 'https://www.notion.so/',
    service: Service,
    permission: {
      origins: ['https://www.notion.so/*'],
      permissions: ['cookies', 'webRequest', 'webRequestBlocking'],
    },
  };
};
