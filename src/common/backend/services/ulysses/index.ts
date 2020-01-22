import Service from './service';
import Form from './form';

export default () => {
  return {
    name: 'Ulysses',
    icon: 'ulysses',
    type: 'ulysses',
    service: Service,
    form: Form,
  };
};
