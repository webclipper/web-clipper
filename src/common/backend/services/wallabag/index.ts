import { ServiceMeta } from './../interface';
import Service from './service';
import form from './form';

export default (): ServiceMeta => {
  return {
    name: 'Wallabag',
    icon: 'wallabag',
    type: 'wallabag',
    service: Service,
    form: form,
    homePage: 'https://www.wallabag.com/',
  };
};
