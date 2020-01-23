import Service from './service';
import Form from './form';

export default () => {
  return {
    name: 'Confluence',
    icon: 'confluence',
    type: 'confluence',
    service: Service,
    form: Form,
  };
};
