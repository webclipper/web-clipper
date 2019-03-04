import browserService from '../../../services/browser/index';
import { Base64ImageToBolb } from '../../utils/bolb';
import axios from 'axios';

export interface YuqueImageHostingOption {
  type: 'yuque';
}

export default class YuqueImageHostingService implements ImageHostingService {
  uploadImage = async ({ data }: UploadImageRequest) => {
    const cookie = await browserService.getCookie({
      url: 'https://yuque.com',
      name: 'ctoken'
    });
    let formData = new FormData();
    const blob = Base64ImageToBolb(data);
    formData.append('file', blob, 'test.png');
    const result = await axios.post(
      `https://www.yuque.com/api/upload/attach?ctoken=${cookie}&type=image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return result.data.data.url;
  };
}
