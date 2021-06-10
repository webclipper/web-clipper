import { IBasicRequestService } from '@/service/common/request';
import { Base64ImageToBlob } from '@/common/blob';
import { UploadImageRequest, ImageHostingService } from '../interface';
import md5 from '@web-clipper/shared/lib/md5';
import Container from 'typedi';
import { RequestHelper } from '@/service/request/common/request';

export interface YuqueImageHostingOption {
  host: string;
}

export default class YuqueImageHostingService implements ImageHostingService {
  getId = () => {
    return md5('sm.ms');
  };

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
    formData.append('smfile', blob);
    formData.append('ssl', 'true');
    const request = new RequestHelper({ request: Container.get(IBasicRequestService) });
    const result = await request.postForm<{ data: { url: string } }>(
      `https://sm.ms/api/v2/upload`,
      { data: formData }
    );
    return result.data.url;
  };
}
