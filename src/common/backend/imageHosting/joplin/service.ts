import { generateUuid } from '@web-clipper/shared/lib/uuid';
import { Base64ImageToBlob } from '@/common/blob';
import axios from 'axios';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { extend, RequestMethod } from 'umi-request';

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
    const res = await axios.get(url, { responseType: 'blob' });
    let blob: Blob = res.data;
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
