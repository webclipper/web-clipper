import { ImageHostingServiceMeta } from '../interface';
import Service from './service';
import Form from './form';

export default (): ImageHostingServiceMeta => {
  return {
    name: 'tencent',
    icon: 'tencent',
    type: 'tencent',
    form: Form,
    service: Service,
  };
};
