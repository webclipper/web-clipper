import axios from 'axios';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { Base64ImageToBlob } from '@/common/blob';

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
    const result = await axios.post(`https://api.imgur.com/3/image`, formData, {
      headers: {
        Authorization: `Client-ID ${this.config.clientId}`,
      },
    });
    return result.data.data.link;
  };
}
