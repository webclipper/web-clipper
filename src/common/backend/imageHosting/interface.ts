export interface ImageHostingServiceConstructAble {
  new (info: any): ImageHostingService;
}

export interface ImageHostingService {
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
}
