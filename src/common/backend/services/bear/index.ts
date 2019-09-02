import Service from './service';
import Form from './form';

export default () => {
  return {
    name: 'Bear',
    icon: 'https://bear.app/static/favicons/favicon-180.png',
    type: 'bear',
    service: Service,
    form: Form,
    homePage: 'https://bear.app/',
  };
};
