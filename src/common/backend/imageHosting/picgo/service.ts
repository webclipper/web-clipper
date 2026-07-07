import { IBasicRequestService } from '@/service/common/request';
import { RequestHelper } from '@/service/request/common/request';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { Base64ImageToBlob } from '@/common/blob';
import Container from 'typedi';
import md5 from '@web-clipper/shared/lib/md5';

export interface PicgoImageHostingOption {
  uploadUrl: string;
  secret: string;
}

export default class PicgoImageHostingService implements ImageHostingService {
  private config: PicgoImageHostingOption;

  constructor(config: PicgoImageHostingOption) {
    this.config = config;
  }

  getId = () => {
    const secret = this.config.secret ? `:${this.config.secret}` : '';
    return md5(`${this.config.uploadUrl}${secret}`); // as id
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
    const formData = new FormData();
    const headers: { Authorization?: string } = {};
    if (this.config.secret) {
      headers.Authorization = `Bearer ${this.config.secret}`;
    }
    formData.append('files', blob, fileName);
    const result = await request.postForm<{ success: boolean; result: string[]; message?: string }>(
      this.config.uploadUrl,
      {
        data: formData,
        headers,
      }
    );
    if (!result.success) throw new Error(result.message || 'Upload failed');
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
    const fileName = 'web_cliper_image';
    let fileExt: string = 'png';
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
