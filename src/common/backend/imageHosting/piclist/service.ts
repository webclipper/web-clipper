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
    let uploadUrl = this.config.uploadUrl;
    if (this.config.key) uploadUrl += `?key=${this.config.key}`;
    return md5(uploadUrl); // as id
  };

  uploadImage = async ({ data }: UploadImageRequest) => {
    const blob = Base64ImageToBlob(data);
    return this.uploadBlob(blob, `web_cliper_image.png`);
  };

  uploadImageUrl = async (url: string) => {
    const imageBlob = await Container.get(IBasicRequestService).download(url);
    return this.uploadBlob(imageBlob, this._getImageFileName(url));
  };

  private uploadBlob = async (blob: Blob, fileName?: string): Promise<string> => {
    const request = new RequestHelper({ request: Container.get(IBasicRequestService) });
    let uploadUrl = this.config.uploadUrl;
    if (this.config.key) uploadUrl += `?key=${this.config.key}`;
    let formData = new FormData();
    formData.append('image', blob, fileName);
    let result = await request.postForm<{ success: boolean; result: string[] }>(uploadUrl, {
      data: formData,
    });
    if (!result.success) throw new Error('Upload failed');
    return result.result[0];
  };
  private _getImageFileName(url: string) {
    // 分割路径和查询参数
    const queryIndex = url.indexOf('?');
    const pathPart = queryIndex === -1 ? url : url.slice(0, queryIndex);
    const queryPart = queryIndex === -1 ? '' : url.slice(queryIndex + 1);

    // 处理路径部分
    const segments = pathPart.split('/');
    let lastSegment = segments.pop() || '';

    // 移除可能的哈希片段
    const hashIndex = lastSegment.indexOf('#');
    if (hashIndex !== -1) {
      lastSegment = lastSegment.slice(0, hashIndex);
    }

    // 检查最后一段是否为文件名
    if (lastSegment.includes('.')) {
      return lastSegment;
    }
    let fileName = "web_cliper_image"
    let fileExt: string = "png";
    // 解析查询参数中的后缀
    const queryParams = new URLSearchParams(queryPart);
    const formatKeys = ['wx_fmt', 'format', 'fm', 'type'];
    for (const key of formatKeys) {
      if (queryParams.has(key)) {
        fileExt = queryParams.get(key) as string;
        if (fileExt) {
          break;
        }
      }
    }

    // 检查路径中的其他段是否有已知图片后缀
    const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'];
    for (const seg of segments) {
      const dotIndex = seg.lastIndexOf('.');
      if (dotIndex !== -1) {
        const ext = seg.slice(dotIndex + 1).toLowerCase();
        if (imageExts.includes(ext)) {
          fileExt = ext;
          break;
        }
      }
    }

    // 默认返回空字符串
    return `${fileName}.${fileExt}`;
  }
}
