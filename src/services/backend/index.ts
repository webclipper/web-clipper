interface BackendFactoryOption {
  type: 'yuque' | 'github';
  accessToken: string;
  baseURL: string;
}

class BackendFactory {
  service: BackendService;
  imageService?: ImageService;

  config(_option: BackendFactoryOption) {
    this.service = {} as BackendService;
    this.service.getUserInfo = async () => {
      return {
        name: '1',
        avatar: '1',
        homePage: '1'
      };
    };
    //Todo
  }
}

export default new BackendFactory();
