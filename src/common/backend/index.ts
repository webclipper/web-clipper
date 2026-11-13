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
    return imageHostingContext(key).default() as ImageHostingServiceMeta;
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

/**
 * 计算某个后端服务在指定配置下所需的权限，兼容静态配置与函数式配置。
 */
export function getServicePermission(
  service?: ServiceMeta,
  info?: any
): chrome.permissions.Permissions | undefined {
  const permission = service?.permission;
  if (!permission) {
    return undefined;
  }
  return typeof permission === 'function' ? permission(info) : permission;
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
