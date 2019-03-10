export const backendServices: {
[key: string]: {
icon: string;
home: string;
api: string;
name: string;
};
} = {
  yuque: {
    icon: 'yuque',
    home: 'https://www.yuque.com',
    api: 'https://www.yuque.com/api/v2/',
    name: '语雀'
  },
  github: {
    icon: 'github',
    home: 'https://www.github.com',
    api: 'https://api.github.com/',
    name: 'Github'
  }
};

export function pluginRouterCreator(id: string) {
  return `/plugins/` + id;
}
