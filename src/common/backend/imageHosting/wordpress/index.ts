import localeService from '@/common/locales';
import { ImageHostingService, ImageHostingServiceMeta, UploadImageRequest } from '../interface';
import { WordPressDocumentService } from '../../services/wordpress';
import { Base64ImageToBlob } from '@/common/blob';
import { IBasicRequestService } from '@/service/common/request';
import { Container } from 'typedi/Container';

class WordpressImageService extends WordPressDocumentService implements ImageHostingService {
  uploadImage = async (request: UploadImageRequest) => {
    const blob = Base64ImageToBlob(request.data);
    return this.uploadBlob(blob);
  };

  uploadImageUrl = async (url: string) => {
    let blob: Blob = await Container.get(IBasicRequestService).download(url);
    // if (blob.type === 'image/webp') {
    //   blob = blob.slice(0, blob.size, 'image/jpeg');
    // }
    return this.uploadBlob(blob);
  };

  private uploadBlob = async (data: Blob): Promise<string> => {
    const ext = data.type.split('/').pop();
    const filename = `${new Date().getTime()}.${ext}`;
    const res = await fetch(`${this.config.host}/wp-json/wp/v2/media`, {
      method: 'POST',
      credentials: 'omit',
      headers: {
        Authorization: `Basic ${this.getToken()}`,
        'Content-Type': data.type,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: data,
    });

    const body = await res.json();
    return body.source_url;
  };
}

export default (): ImageHostingServiceMeta => {
  return {
    name: localeService.format({
      id: 'backend.imageHosting.wordpress.name',
    }),
    icon: 'wordpress',
    type: 'wordpress',
    service: WordpressImageService,
    builtIn: true,
    builtInRemark: localeService.format({
      id: 'backend.imageHosting.wordpress.builtInRemark',
      defaultMessage: 'WordPress Media Service.',
    }),
  };
};
