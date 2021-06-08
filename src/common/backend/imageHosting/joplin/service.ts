import { IBasicRequestService } from '@/service/common/request';
import { generateUuid } from '@web-clipper/shared/lib/uuid';
import { Base64ImageToBlob } from '@/common/blob';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { extend, RequestMethod } from 'umi-request';
import Container from 'typedi';

export interface JoplinImageHostingOption {
  token: string;
}

export default class YuqueImageHostingService implements ImageHostingService {
  private request: RequestMethod;

  constructor({ token }: JoplinImageHostingOption) {
    this.request = extend({
      prefix: 'http://localhost:41184/',
      params: {
        token: token,
      },
    });
  }

  getId() {
    return 'joplin';
  }

  uploadImage = async ({ data }: UploadImageRequest) => {
    const blob = Base64ImageToBlob(data);
    return this.uploadBlob(blob);
  };

  uploadImageUrl = async (url: string) => {
    let blob: Blob = await Container.get(IBasicRequestService).download(url);
    if (blob.type === 'image/webp') {
      blob = blob.slice(0, blob.size, 'image/jpeg');
    }
    return this.uploadBlob(blob);
  };

  private uploadBlob = async (blob: Blob): Promise<string> => {
    let formData = new FormData();
    formData.append('data', blob);
    formData.append(
      'props',
      JSON.stringify({
        title: generateUuid(),
      })
    );
    const result = await this.request.post(`resources`, {
      data: formData,
    });
    return `:/${result.id}`;
  };
}
