import { IBasicRequestService } from '@/service/common/request';
import { Base64ImageToBlob } from '@/common/blob';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { generateUuid } from '@web-clipper/shared/lib/uuid';
import Container from 'typedi';
import { isUndefined } from 'lodash';
import COS from 'cos-js-sdk-v5';

export interface QcloudCosImageHostingOption {
  bucket: string;
  region: string;
  folder: string;
  secretId: string;
  secretKey: string;
  privateRead: boolean;
  expires: number;
}

export default class QcloudCosImageHostingService implements ImageHostingService {
  private config: QcloudCosImageHostingOption;

  constructor(config: QcloudCosImageHostingOption) {
    this.config = config;
  }

  getId = () => {
    return this.config.bucket;
  };

  uploadImage = async ({ data }: UploadImageRequest) => {
    const blob = Base64ImageToBlob(data);
    return this.uploadAsBlob(blob);
  };

  uploadImageUrl = async (url: string) => {
    const imageBlob = await Container.get(IBasicRequestService).download(url);
    return this.uploadAsBlob(imageBlob);
  };

  private generateFilename = (blob: Blob): string => {
    const matchedSuffix: any = blob.type.match(/^image\/(.*)/);
    const suffix: string = matchedSuffix[1];
    return `${generateUuid()}.${suffix}`;
  };

  private uploadAsBlob = async (blob: Blob): Promise<string> => {
    if (isUndefined(this.config.folder)) this.config.folder = '';
    if (this.config.folder.startsWith('/')) this.config.folder.substr(1);
    if (!this.config.folder.endsWith('/') && this.config.folder.length > 0)
      this.config.folder += '/';

    const fileName = this.generateFilename(blob);
    const date = new Date();
    const folderName = `${date.getFullYear()}${date.getMonth()}${date.getDay()}`;
    let cos = new COS({
      SecretId: this.config.secretId,
      SecretKey: this.config.secretKey,
    });
    await cos.putObject({
      Bucket: this.config.bucket,
      Region: this.config.region,
      Key: `${this.config.folder}${folderName}/${fileName}`,
      Body: blob,
    });
    return cos.getObjectUrl(
      {
        Bucket: this.config.bucket,
        Region: this.config.region,
        Key: `${this.config.folder}${folderName}/${fileName}`,
        Sign: this.config.privateRead,
        Expires: this.config.expires,
      },
      (err, data) => {
        if (err) throw err;
        return data.Url;
      }
    );
  };
}
