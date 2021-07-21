import { WebClipperConfiguration } from '@/service/common/configuration';

interface IGenerateLocalConfigOptions {
  locale: string;
}

const generateLocalConfig = (_options: IGenerateLocalConfigOptions): WebClipperConfiguration => {
  return {
    resource: {
      host: '',
      privacy: '',
      changelog: '',
    },
    yuque_oauth: {
      clientId: 'D1AwzCeDPLFWGfcGv7ze',
      callback: 'http://webclipper-oauth.yfd.im/yuque_oauth',
      scope: '94f779401c7bed8734ce',
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
