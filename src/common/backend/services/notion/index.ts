import { ServiceMeta } from '@/common/backend';
import Service from './service';

export default (): ServiceMeta => {
  return {
    name: 'Notion',
    icon: 'https://www.notion.so/images/favicon.ico',
    type: 'notion',
    homePage: 'https://app.notion.com/',
    service: Service,
    permission: {
      origins: ['https://www.notion.so/*', 'https://app.notion.com/*'],
      permissions: ['cookies'],
    },
  };
};
