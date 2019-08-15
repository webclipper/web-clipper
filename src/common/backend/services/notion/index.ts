import { ServiceMeta } from '@/common/backend';
import Service from './service';

export default (): ServiceMeta => {
  return {
    name: 'notion',
    icon: 'https://www.notion.so/images/favicon.ico',
    type: 'notion',
    homePage: 'https://www.notion.so/',
    service: Service,
  };
};
