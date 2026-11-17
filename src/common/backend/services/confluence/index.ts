import Service from './service';
import Form from './form';

export default () => {
  return {
    name: 'Confluence 6',
    icon: 'confluence',
    type: 'confluence',
    service: Service,
    form: Form,
  };
};
