import browserService from '../../../browser';
import { Base64ImageToBlob } from '../../../blob';
import axios from 'axios';
import { UploadImageRequest, ImageHostingService } from '../interface';
import md5 from '@web-clipper/shared/lib/md5';

export interface YuqueImageHostingOption {
  host: string;
}

export default class YuqueImageHostingService implements ImageHostingService {
  getId = () => {
    return md5('yuque');
  };

  uploadImage = async ({ data }: UploadImageRequest) => {
    const cookie = await browserService.getCookie({
      url: 'https://yuque.com',
      name: 'ctoken',
    });
    let formData = new FormData();
    const blob = Base64ImageToBlob(data);
    formData.append('file', blob, 'test.png');
    const result = await axios.post(
      `https://www.yuque.com/api/upload/attach?ctoken=${cookie}&type=image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return result.data.data.url;
  };

  uploadImageUrl = async (url: string) => {
    const res = await axios.get(url, { responseType: 'blob' });
    let blob: Blob = res.data;

    if (blob.type === 'image/webp') {
      blob = blob.slice(0, blob.size, 'image/jpeg');
    }
    let formData = new FormData();
    formData.append('file', blob, 'test.png');
    const cookie = await browserService.getCookie({
      url: 'https://yuque.com',
      name: 'ctoken',
    });
    const result = await axios.post(
      `https://www.yuque.com/api/upload/attach?ctoken=${cookie}&type=image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return result.data.data.url;
  };
}
