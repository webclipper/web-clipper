import { generateUuid } from '@web-clipper/shared/lib/uuid';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { TencentImageHostingOption } from './type';
import { IBasicRequestService } from '@/service/common/request';
import { BlobToBase64 } from 'common/blob';
import { Container } from 'typedi';
import { isUndefined } from 'lodash';

const COS = require('cos-js-sdk-v5');
export default class TencentImageHostingService implements ImageHostingService {
  private config: TencentImageHostingOption;
  private cosClient;

  constructor(config: TencentImageHostingOption) {
    this.config = config;
    this.cosClient = new COS({
      SecretId: this.config.secretId,
      SecretKey: this.config.secretKey,
    });
  }

  getId(): string {
    return this.config.secretId;
  }

  uploadImage = async ({ data }: UploadImageRequest) => {
    return this.uploadBase64(data);
  };

  uploadImageUrl = async (url: string) => {
    let imageBlob: Blob = await Container.get(IBasicRequestService).download(url);
    const imageBase64 = await BlobToBase64(imageBlob);
    return this.uploadBase64(imageBase64);
  };
  private uploadBase64 = async (base64Data: string): Promise<string> => {
    let dataURLtoBlob = function(dataurl: string) {
      let arr = dataurl.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    };
    if (isUndefined(this.config.savePath)) this.config.savePath = '';
    if (this.config.savePath.startsWith('/')) this.config.savePath.substr(1);
    if (!this.config.savePath.endsWith('/') && this.config.savePath.length > 0)
      this.config.savePath += '/';
    const fileName = this.generateFilename(base64Data);
    const key = `${this.config.savePath}${fileName}`;
    this.cosClient.putObject(
      {
        Bucket: this.config.bucket,
        Region: this.config.region,
        Key: key,
        Body: dataURLtoBlob(base64Data),
      },
      function(err: any, data: any) {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log(data.Location);
      }
    );
    if (isUndefined(this.config.domain) || this.config.domain === '') {
      return `https://${this.config.bucket}.cos.${this.config.region}.myqcloud.com/${key}`;
    }
    return `${this.config.domain}/${key}`;
  };
  private generateFilename = (data: string): string => {
    const matchedSuffix: any = data.match(/^data:image\/(.*);base64,/);
    const suffix: string = matchedSuffix[1];
    return `${generateUuid()}\.${suffix}`;
  };
}
