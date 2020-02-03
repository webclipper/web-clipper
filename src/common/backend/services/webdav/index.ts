import Service from './service';
import Form from './form';

export default () => {
  return {
    name: 'WebDAV',
    icon: 'webdav',
    type: 'webdav',
    service: Service,
    form: Form,
    homePage: '',
  };
};
