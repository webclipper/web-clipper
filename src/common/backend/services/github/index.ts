import Service from './service';
import Form from './form';

export default () => {
  return {
    name: 'Github',
    icon: 'github',
    type: 'github',
    service: Service,
    form: Form,
    homePage: 'https://github.com/',
  };
};
