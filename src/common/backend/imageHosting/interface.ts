import { Repository } from '../services/interface';

export interface ImageHostingServiceConstructAble {
  new (info: any): ImageHostingService;
}

export interface ImageHostingService {
  getId(): string;

  uploadImage(request: UploadImageRequest): Promise<string>;

  uploadImageUrl(url: string): Promise<string>;

  updateContext?({ currentRepository }: { currentRepository: Repository }): void;
}

export interface UploadImageRequest {
  data: string;
}

export interface ImageHostingServiceMeta {
  name: string;
  icon: string;
  type: string;
  service: ImageHostingServiceConstructAble;
  form?: any;
  support?: (type: string) => boolean;
  builtIn?: boolean;
  builtInRemark?: string;
  permission?: chrome.permissions.Permissions;
}

export const BUILT_IN_IMAGE_HOSTING_ID = 'BUILT_IN_IMAGE_HOSTING_ID';
