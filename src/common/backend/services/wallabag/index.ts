import { ServiceMeta } from './../interface';
import Service from './service';
import Form from './form';

export default (): ServiceMeta => {
  return {
    name: 'Wallabag',
    icon: 'wallabag',
    type: 'wallabag',
    service: Service,
    form: Form,
    homePage: 'https://www.wallabag.com/',
  };
};
