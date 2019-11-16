import { ServiceMeta } from './../interface';
import Service from './service';
import Form from './form';
import headerForm from './headerForm';

export default () => {
  return {
    name: 'Github',
    icon: 'github',
    type: 'github',
    service: Service,
    form: Form,
    headerForm: headerForm,
    homePage: 'https://github.com/',
  } as ServiceMeta;
};
