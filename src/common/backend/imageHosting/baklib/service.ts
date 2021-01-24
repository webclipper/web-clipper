import { Base64ImageToBlob, BlobToBase64 } from '@/common/blob';
import { UploadImageRequest, ImageHostingService } from '../interface';
import md5 from '@web-clipper/shared/lib/md5';
import { extend, RequestMethod } from 'umi-request';
import { BaklibBackendServiceConfig } from '../../services/baklib/interface';
import { Repository } from '../../services/interface';
export interface YuqueImageHostingOption {
  access_token: string;
}

export default class YuqueImageHostingService implements ImageHostingService {
  private accessToken: string;
  private request: RequestMethod;
  private context?: { currentRepository: Repository };

  constructor({ accessToken }: BaklibBackendServiceConfig) {
    this.accessToken = accessToken;
    this.request = extend({
      prefix: 'https://www.baklib-free.com/api/',
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 5000,
    });
    this.request.interceptors.response.use(
      async response => {
        const json = await response.clone().json();
        if (json.code !== 0) {
          throw new Error(json.message || json.error);
        }
        return response;
      },
      { global: false }
    );
  }

  getId() {
    return md5(this.accessToken);
  }

  uploadImage = async ({ data }: UploadImageRequest) => {
    const blob = Base64ImageToBlob(data);
    return this.uploadBlob(blob);
  };

  uploadImageUrl = async (url: string) => {
    const res = await extend({}).get(url, {
      responseType: 'blob',
    });
    let blob: Blob = res;
    if (blob.type === 'image/webp') {
      blob = blob.slice(0, blob.size, 'image/jpeg');
    }
    return this.uploadBlob(blob);
  };

  updateContext = (context: { currentRepository: Repository }) => {
    this.context = context;
  };

  private uploadBlob = async (blob: Blob): Promise<string> => {
    if (!this.context?.currentRepository.id) {
      throw new Error('请选择站点');
    }
    console.log('this.context?.currentRepository.id', this.context?.currentRepository.id);
    let formData = new FormData();
    formData.append('base64', await BlobToBase64(blob));
    formData.append('tenant_id', this.context?.currentRepository.id);
    const result = await this.request.post(`v1/image/upload`, {
      data: formData,
      requestType: 'form',
    });
    return result.message.url;
  };
}
