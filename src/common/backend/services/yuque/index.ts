import { ServiceMeta } from './../interface';
import Service from './service';
import Form from './form';
import Complete from './complete';

export default {
  name: '语雀',
  icon: 'yuque',
  type: 'yuque',
  service: Service,
  form: Form,
  homePage: 'https://www.yuque.com',
  complete: Complete,
} as ServiceMeta;
