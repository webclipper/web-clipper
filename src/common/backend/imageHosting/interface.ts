export interface ImageHostingServiceConstructAble {
  new (info: any): ImageHostingService;
}

export interface ImageHostingService {
  getId(): string;

  uploadImage(request: UploadImageRequest): Promise<string>;

  uploadImageUrl(url: string): Promise<string>;
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
}

export const BUILT_IN_IMAGE_HOSTING_ID = 'BUILT_IN_IMAGE_HOSTING_ID';
