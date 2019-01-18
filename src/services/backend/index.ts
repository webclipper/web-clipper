import YuqueBackendService from './yuque';

interface BackendFactoryOption {
  type: 'yuque' | 'github';
  accessToken: string;
  baseURL: string;
}

class BackendFactory {
  service: BackendService;
  imageService?: ImageService;

  config(option: BackendFactoryOption) {
    if (option.type === 'yuque') {
      let { accessToken, baseURL } = option;
      this.service = new YuqueBackendService({
        baseURL,
        accessToken
      });
    }
    //Todo
  }
}

export default new BackendFactory();
