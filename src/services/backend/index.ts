import {
  DocumentService,
  ImageHostingService,
} from './../../common/backend/index';
import GithubDocumentService from '../../common/backend/github/service';
import YuqueDocumentService from '../../common/backend/yuque/service';
import YuqueImageHostingService, {
  YuqueImageHostingOption,
} from './imageHosting/yuque';

interface DocumentServiceOption {
  type: string;
  info?: any;
}

export class BackendContext {
  private documentService?: DocumentService;
  private imageHostingService?: ImageHostingService;

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
  const { type, info } = option;
  if (type === 'yuque') {
    return new YuqueDocumentService(info);
  }
  if (type === 'github') {
    return new GithubDocumentService(info);
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
