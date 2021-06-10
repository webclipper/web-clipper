import { IBasicRequestService } from '@/service/common/request';
import { Base64ImageToBlob } from '@/common/blob';
import { UploadImageRequest, ImageHostingService } from '../interface';
import backend from '../..';
import { message } from 'antd';
import localeService from '@/common/locales';
import Container from 'typedi';

/**
 * Use leanote as image hosting service by embbeding images to note body
 */
export default class LeanoteImageHostingService implements ImageHostingService {
  getId = () => {
    return 'leanote';
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

  /**
   * Delegate image saving to document service
   *
   * @param blob
   *
   * @return string image url once hosted
   */
  private uploadBlob = async (blob: Blob): Promise<string> => {
    message.destroy();
    message.warning(
      localeService.format({
        id: 'backend.services.leanote.warning.image.host.saving.delayed',
        defaultMessage: 'Image will be attached only if the current clipping is saved',
      })
    );
    return (backend.getDocumentService()! as any).uploadBlob(blob);
  };
}
