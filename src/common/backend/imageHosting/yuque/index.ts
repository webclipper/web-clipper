import { ImageHostingServiceMeta } from './../interface';
import Service from './service';
import Form from './form';

const meta: ImageHostingServiceMeta = {
  name: '语雀',
  icon: 'yuque',
  type: 'yuque',
  service: Service,
  form: Form,
};

export default meta;
