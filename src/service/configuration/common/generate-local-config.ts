import { WebClipperConfiguration } from '@/service/common/configuration';

interface IGenerateLocalConfigOptions {
  we: 'w';
}

const generateLocalConfig = (_options: IGenerateLocalConfigOptions): WebClipperConfiguration => {
  return {
    resource: {
      host: '',
      privacy: '',
      changelog: '',
    },
    yuque_oauth: {
      clientId: '',
      callback: '',
      scope: '',
    },
    onenote_oauth: {
      clientId: '',
      callback: '',
    },
    google_oauth: {
      clientId: '',
      callback: '',
    },
    github_oauth: {
      clientId: '',
      callback: '',
    },
  };
};

export { generateLocalConfig };
