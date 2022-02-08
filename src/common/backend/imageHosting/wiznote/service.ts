import { UploadImageRequest, ImageHostingService } from '../interface';
import { Base64ImageToBlob } from 'common/blob';
import Container from 'typedi';
import { IBasicRequestService } from '@/service/common/request';
import backend from 'common/backend';
import WizNoteDocumentService from 'common/backend/services/wiznote/service';

export interface WizImageHostingOption {
  token: string;
}

export default class WizNoteImageHostingService implements ImageHostingService {
  getId() {
    return 'wiznote';
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
    return (backend.getDocumentService()! as WizNoteDocumentService).uploadBlob(blob);
  };
}
