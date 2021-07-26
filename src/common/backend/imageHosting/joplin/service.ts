import { RequestHelper } from '@/service/request/common/request';
import { JoplinClient } from './../../clients/joplin/index';
import { IJoplinClient } from './../../clients/joplin/types';
import { IBasicRequestService } from '@/service/common/request';
import { Base64ImageToBlob } from '@/common/blob';
import { UploadImageRequest, ImageHostingService } from '../interface';
import Container from 'typedi';

export interface JoplinImageHostingOption {
  token: string;
}

export default class JoplinImageHostingService implements ImageHostingService {
  private client: IJoplinClient;
  private token: string;

  constructor({ token }: JoplinImageHostingOption) {
    this.token = token;
    const request = new RequestHelper({
      baseURL: 'http://localhost:41184/',
      request: Container.get(IBasicRequestService),
      params: {
        token: token,
      },
    });
    this.client = new JoplinClient(request);
  }

  getId() {
    return this.token;
  }

  uploadImage = async ({ data }: UploadImageRequest) => {
    const blob = Base64ImageToBlob(data);
    return this.client.uploadBlob(blob);
  };

  uploadImageUrl = async (url: string) => {
    let blob: Blob = await Container.get(IBasicRequestService).download(url);
    if (blob.type === 'image/webp') {
      blob = blob.slice(0, blob.size, 'image/jpeg');
    }
    return this.client.uploadBlob(blob);
  };
}
