import { IBasicRequestService } from '@/service/common/request';
import { RequestHelper } from '@/service/request/common/request';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { Base64ImageToBlob } from '@/common/blob';
import Container from 'typedi';

export interface ImgurImageHostingOption {
  clientId: string;
}

export default class ImgurImageHostingService implements ImageHostingService {
  private config: ImgurImageHostingOption;

  constructor(config: ImgurImageHostingOption) {
    this.config = config;
  }

  getId = () => {
    return this.config.clientId;
  };

  uploadImage = async ({ data }: UploadImageRequest) => {
    const blob = Base64ImageToBlob(data);
    return this.uploadBlob(blob);
  };

  uploadImageUrl = async (url: string) => {
    return this.uploadBlob(url);
  };

  private uploadBlob = async (blob: Blob | string): Promise<string> => {
    let formData = new FormData();
    formData.append('image', blob);
    const request = new RequestHelper({ request: Container.get(IBasicRequestService) });
    const result = await request.postForm<{ data: { link: string } }>(
      `https://api.imgur.com/3/image`,
      {
        data: formData,
        headers: {
          Authorization: `Client-ID ${this.config.clientId}`,
        },
      }
    );
    return result.data.link;
  };
}
