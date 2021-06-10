import { IBasicRequestService } from '@/service/common/request';
import { Base64ImageToBlob } from '@/common/blob';
import { UploadImageRequest, ImageHostingService } from '../interface';
import md5 from '@web-clipper/shared/lib/md5';
import { extend } from 'umi-request';
import localeService from '@/common/locales';
import Container from 'typedi';

const request = extend({});

request.interceptors.response.use(
  response => {
    const codeMaps: {
      [code: number]: string;
    } = {
      429: localeService.format({
        id: 'backend.imageHosting.yuque_oauth.error_429',
        defaultMessage: 'Requests are too frequent.Request limit 100 per hour.',
      }),
      401: localeService.format({
        id: 'backend.imageHosting.yuque_oauth.error_401',
        defaultMessage: 'No permission, need to delete the current account and re authorize.',
      }),
      403: localeService.format({
        id: 'backend.imageHosting.yuque_oauth.error_403',
        defaultMessage: 'No permission, need to delete the current account and re authorize.',
      }),
    };
    if (codeMaps[response.status]) {
      throw new Error(codeMaps[response.status]);
    }
    return response;
  },
  { global: false }
);

export interface YuqueImageHostingOption {
  access_token: string;
}

const HOST = 'https://www.yuque.com';
const BASE_URL = `${HOST}/api/v2/`;

export default class YuqueImageHostingService implements ImageHostingService {
  private accessToken: string;

  constructor({ access_token }: YuqueImageHostingOption) {
    this.accessToken = access_token;
  }

  getId() {
    return md5(this.accessToken);
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
    formData.append('file', blob, 'file.png');
    const result = await request.post(`${BASE_URL}upload/attach`, {
      data: formData,
      requestType: 'form',
      headers: {
        'X-Auth-Token': this.accessToken,
      },
    });
    return result.data.url;
  };
}
