import { generateUuid } from '@web-clipper/shared/lib/uuid';
import { BlobToBase64 } from '@/common/blob';
import Axios, { AxiosInstance } from 'axios';
import { UploadImageRequest, ImageHostingService } from '../interface';
import { isUndefined } from 'lodash';

export interface GithubImageHostingOption {
  accessToken: string;
  savePath: string;
  repoName: string;
}

export default class GithubImageHostingService implements ImageHostingService {
  private config: GithubImageHostingOption;
  private request: AxiosInstance;
  private username: string;
  private date: Date;
  constructor(config: GithubImageHostingOption) {
    this.username = '';
    this.config = config;
    this.date = new Date();
    this.request = Axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        Accept: 'application/vnd.github.v3+object',
        Authorization: `token ${this.config.accessToken}`,
      },
      timeout: 10000,
      transformResponse: [
        (data): string => {
          return JSON.parse(data);
        },
      ],
      withCredentials: true,
    });
  }

  getId() {
    return this.config.accessToken;
  }

  uploadImage = async ({ data }: UploadImageRequest) => {
    return this.uploadAsBase64(data);
  };

  uploadImageUrl = async (url: string) => {
    const image = await Axios.get(url, { responseType: 'blob' });
    const imageBlob = image.data;
    const imageBase64 = await BlobToBase64(imageBlob);
    return this.uploadAsBase64(imageBase64);
  };

  private async getUserName() {
    const response = await this.request.get<{ login: string }>('/user').catch(() => {
      throw new Error('Get Username Error');
    });
    return response.data.login;
  }

  private generateFilename = (data: string): string => {
    const matchedSuffix: any = data.match(/^data:image\/(\w*);base64,/);
    const suffix: string = matchedSuffix[1];
    return `${generateUuid()}\.${suffix}`;
  };

  private uploadAsBase64 = async (data: string): Promise<string> => {
    if (this.username === '') {
      try {
        this.username = await this.getUserName();
      } catch (error) {
        throw error;
      }
    }

    if (isUndefined(this.config.savePath)) this.config.savePath = '';
    if (this.config.savePath.startsWith('/')) this.config.savePath.substr(1);
    if (!this.config.savePath.endsWith('/') && this.config.savePath.length > 0)
      this.config.savePath += '/';

    const fileName = this.generateFilename(data);
    const folderName = this.date
      .toLocaleString('chinese', { hour12: false })
      .replace(new RegExp('/', 'g'), '-')
      .replace(new RegExp(':', 'g'), '-');
    const filteredImage = data.replace(/^data:image\/\w+;base64,/, '');
    const response = await this.request
      .put(
        `/repos/${this.username}/${this.config.repoName}/contents/${this.config.savePath}${folderName}/${fileName}`,
        {
          message: `Upload image "${fileName}"`,
          content: filteredImage,
        }
      )
      .catch(error => {
        throw Error(error);
      });

    return response ? response.data.content.html_url : {};
  };
}
