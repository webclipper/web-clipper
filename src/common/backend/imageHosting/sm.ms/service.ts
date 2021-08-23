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
  private secretToken?: string;
  constructor(info: { secretToken?: string }) {
    this.secretToken = info.secretToken;
  }
  getId = () => {
    return md5(this.secretToken ?? 'sm.ms');
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
    let headers: { Authorization?: string } = {};
    if (this.secretToken) {
      headers.Authorization = this.secretToken;
    }
    const request = new RequestHelper({
      request: Container.get(IBasicRequestService),
      headers: headers,
    });
    const result = await request.postForm<
      { data: { url: string } } | { code: string; success: false; images: string; message: string }
    >(`https://sm.ms/api/v2/upload`, { data: formData });
    if (isFail(result)) {
      if (result.code !== 'image_repeated') {
        throw new Error(result.message);
      }
      return result.images;
    }
    return result.data.url;
  };
}

function isFail(
  rs: { data: { url: string } } | { code: string; success: false; images: string }
): rs is { code: string; success: false; images: string } {
  if (!(rs as { code: string; success: false; images: string }).success) {
    return true;
  }
  return false;
}
