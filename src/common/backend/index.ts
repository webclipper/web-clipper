import {
  ServiceMeta,
  ImageHostingServiceMeta,
  ImageHostingService,
  DocumentService,
} from './interface';
export * from './interface';

const serviceContext = require.context('./services', true, /index.ts$/);

const services: ServiceMeta[] = serviceContext.keys().map(key => {
  return serviceContext(key).default;
});

const imageHostingContext = require.context(
  './imageHosting',
  true,
  /index.ts$/
);

const imageHostingServices: ImageHostingServiceMeta[] = imageHostingContext
  .keys()
  .map(key => {
    return imageHostingContext(key).default;
  });

export function documentServiceFactory(type: string, info?: any) {
  const service = services.find(o => o.type === type);
  if (service) {
    const Service = service.service;
    return new Service(info);
  }
  throw new Error('unSupport type');
}

export function imageHostingServiceFactory(type: string, info?: any) {
  const service = imageHostingServices.find(o => o.type === type);
  if (service) {
    const Service = service.service;
    return new Service(info);
  }
  throw new Error('un support image hosting type');
}

export { imageHostingServices, services };

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
