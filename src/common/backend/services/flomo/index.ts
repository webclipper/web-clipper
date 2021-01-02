import Service from './service';

export default () => {
  return {
    name: 'Flomo',
    icon: 'flomo',
    type: 'flomo',
    service: Service,
    homePage: 'https://flomoapp.com/',
    permission: {
      origins: ['https://flomoapp.com/*'],
      permissions: ['cookies', 'webRequest', 'webRequestBlocking'],
    },
  };
};
