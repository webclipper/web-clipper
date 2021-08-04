import { Base64ImageToBlob } from '@/common/blob';
import { Container } from 'typedi';
import { IBasicRequestService } from './../../../../service/common/request';
import { SiYuanClient } from './../../clients/siyuan/client';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { Repository } from '../../services/interface';
export interface YuqueImageHostingOption {
  access_token: string;
}

export default class SiYuanImageHostingService implements ImageHostingService {
  private context: { currentRepository: Repository } | null = null;
  private siyuan: SiYuanClient;
  constructor(config: { accessToken?: string }) {
    this.siyuan = new SiYuanClient({
      request: Container.get(IBasicRequestService),
      accessToken: config.accessToken,
    });
  }

  getId() {
    return 'siyuan';
  }

  uploadImage = async ({ data }: UploadImageRequest) => {
    const blob = Base64ImageToBlob(data);
    return this.siyuan.uploadImage(blob, this.context?.currentRepository.id!);
  };

  uploadImageUrl = async (url: string) => {
    let blob: Blob = await Container.get(IBasicRequestService).download(url);
    if (blob.type === 'image/webp') {
      blob = blob.slice(0, blob.size, 'image/jpeg');
    }
    return this.siyuan.uploadImage(blob, this.context?.currentRepository.id!);
  };

  updateContext = (context: { currentRepository: Repository }) => {
    this.context = context;
  };
}
