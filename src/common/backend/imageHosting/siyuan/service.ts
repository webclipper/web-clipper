import { Base64ImageToBlob } from '@/common/blob';
import { Container } from 'typedi';
import { IBasicRequestService } from './../../../../service/common/request';
import { SiYuanClient } from './../../clients/siyuan/client';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { Repository } from '../../services/interface';
export interface YuqueImageHostingOption {
  access_token: string;
}

export default class YuqueImageHostingService implements ImageHostingService {
  private context: { currentRepository: Repository } | null = null;
  private siyuan: SiYuanClient;
  constructor() {
    this.siyuan = new SiYuanClient({
      request: Container.get(IBasicRequestService),
    });
  }

  getId() {
    return 'siyuan';
  }

  uploadImage = async ({ data }: UploadImageRequest) => {
    const blob = Base64ImageToBlob(data);
    this.siyuan.we(blob, this.context?.currentRepository.id!);
    return '';
  };

  uploadImageUrl = async (url: string) => {
    console.log('context', this.context, url);
    return 'this.uploadBlob(blob);';
  };

  updateContext = (context: { currentRepository: Repository }) => {
    this.context = context;
  };
}
