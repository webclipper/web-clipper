import { IBasicRequestService } from '@/service/common/request';
import { RequestHelper } from '@/service/request/common/request';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { Base64ImageToBlob } from '@/common/blob';
import Container from 'typedi';
import md5 from '@web-clipper/shared/lib/md5';

export interface PiclistImageHostingOption {
  uploadUrl: string;
  key: string;
}

export default class PiclistImageHostingService implements ImageHostingService {
  private config: PiclistImageHostingOption;

  constructor(config: PiclistImageHostingOption) {
    this.config = config;
  }

  getId = () => {
    let uploadUrl = this.config.uploadUrl
    if(this.config.key)
      uploadUrl += `?key=${this.config.key}`
    return md5(uploadUrl)    // as id
  };

  uploadImage = async ({ data }: UploadImageRequest) => {
    const blob = Base64ImageToBlob(data);
    return this.uploadBlob(blob);
  };

  uploadImageUrl = async (url: string) => {
    const imageBlob = await Container.get(IBasicRequestService).download(url);
    return this.uploadBlob(imageBlob);
  };

  private uploadBlob = async (blob: Blob): Promise<string> => {
    const request = new RequestHelper({ request: Container.get(IBasicRequestService) });
    let uploadUrl = this.config.uploadUrl
    if(this.config.key)
      uploadUrl += `?key=${this.config.key}`
    let formData = new FormData();
    formData.append('image', blob);
    let result = await request.postForm<{ success: boolean, result: string[] }>(
      uploadUrl,
      {
        data: formData,
      }
    );
    if(!result.success)
      throw new Error("Upload failed");
    return result.result[0];
  };
}
