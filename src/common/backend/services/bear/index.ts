import Service from './service';
import Form from './form';

export default () => {
  return {
    name: 'Bear',
    icon: 'bear',
    type: 'bear',
    service: Service,
    form: Form,
    homePage: 'https://bear.app/',
  };
};
