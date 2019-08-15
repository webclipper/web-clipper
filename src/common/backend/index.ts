import {
  ServiceMeta,
  ImageHostingServiceMeta,
  ImageHostingService,
  DocumentService,
} from './interface';
export * from './interface';

const serviceContext = require.context('./services', true, /index.ts$/);

const getServices = (): ServiceMeta[] => {
  return serviceContext.keys().map(key => {
    return serviceContext(key).default() as ServiceMeta;
  });
};
const imageHostingContext = require.context('./imageHosting', true, /index.ts$/);

const getImageHostingServices = (): ImageHostingServiceMeta[] => {
  return imageHostingContext.keys().map(key => {
    return imageHostingContext(key).default;
  });
};

export function documentServiceFactory(type: string, info?: any) {
  const service = getServices().find(o => o.type === type);
  if (service) {
    const Service = service.service;
    return new Service(info);
  }
  throw new Error('unSupport type');
}

export function imageHostingServiceFactory(type: string, info?: any) {
  const service = getImageHostingServices().find(o => o.type === type);
  if (service) {
    const Service = service.service;
    return new Service(info);
  }
  throw new Error('un support image hosting type');
}

export { getServices, getImageHostingServices };

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

export default new BackendContext();
