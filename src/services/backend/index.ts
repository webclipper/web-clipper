import GithubDocumentService from './github';
import YuqueDocumentService from './yuque';
import YuqueImageHostingService, {
  YuqueImageHostingOption
} from './imageHosting/yuque';

interface DocumentServiceOption {
  type: string;
  accessToken: string;
  baseURL: string;
}

export class BackendContext {
  private documentService: DocumentService;
  private imageHostingService: ImageHostingService;

  setDocumentService(documentService: DocumentService) {
    this.documentService = documentService;
  }

  getDocumentService() {
    return this.documentService;
  }

  setImageHostingService(imageHostingService: ImageHostingService) {
    this.imageHostingService = imageHostingService;
  }

  getImageHostingService() {
    return this.imageHostingService;
  }
}

export function documentServiceFactory(
  option: DocumentServiceOption
): DocumentService {
  const { type, baseURL, accessToken } = option;
  if (type === 'yuque') {
    return new YuqueDocumentService({
      baseURL,
      accessToken
    });
  }
  if (type === 'github') {
    return new GithubDocumentService({
      baseURL,
      accessToken
    });
  }
  throw new Error('unSupport type');
}

type ImageHostingServiceFactoryOption = YuqueImageHostingOption;

export function imageHostingServiceFactory(
  option: ImageHostingServiceFactoryOption
) {
  if (option.type === 'yuque') {
    return new YuqueImageHostingService();
  }
  throw new Error('un support image hosting type');
}

export default new BackendContext();
