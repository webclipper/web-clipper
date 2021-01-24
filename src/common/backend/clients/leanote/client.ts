import { IExtendRequestHelper, IRequestService } from '@/service/common/request';
import { CreateDocumentRequest } from '../../index';
import { RequestHelper } from '@/service/request/common/request';
import showdown from 'showdown';
import {
  LeanoteBackendServiceConfig,
  LeanoteCreateDocumentResponse,
  LeanoteNotebook,
  LeanoteResponse,
} from './interface';
const FormData = require('form-data');

const converter = new showdown.Converter();
/**
 * Client for self hosted leanote or leanote.com
 */
export default class LeanoteClient {
  private config: LeanoteBackendServiceConfig;
  private request: IExtendRequestHelper;
  private formData: FormData;
  private imagesCount: number;

  /**
   * This class wrap a IExtendRequestHelper to perform HTTP request
   */
  constructor(
    { leanote_host, email, pwd, token_cached }: LeanoteBackendServiceConfig,
    request: IRequestService
  ) {
    this.config = { leanote_host, email, pwd, token_cached };
    this.formData = new FormData();
    this.imagesCount = 0;
    this.request = new RequestHelper({
      baseURL: this.config.leanote_host,
      request: request,
    });
  }

  /**
   * @TODO: Support markdown
   *
   * Perform a POST with document request as formData to leanote server to create a note
   *
   * @see documentation https://github.com/leanote/leanote/wiki/leanote-api
   */
  createDocument = async (info: CreateDocumentRequest): Promise<LeanoteCreateDocumentResponse> => {
    this.formData.append('NotebookId', info.repositoryId);
    this.formData.append('Title', info.title);
    this.formData.append('Content', converter.makeHtml(info.content));
    const formData = this.formData;
    this.formData = new FormData();
    this.imagesCount = 0;
    return this.request.postForm<LeanoteCreateDocumentResponse>(
      `/api/note/addNote?token=${this.config.token_cached}`,
      {
        data: formData,
      }
    );
  };

  /**
   * Append blob accordingly in the formData and guess computed image url
   *
   * @see documentation https://github.com/leanote/leanote/wiki/leanote-api
   */
  uploadBlob = async (blob: Blob): Promise<string> => {
    const ext = blob.type.split('/').pop();
    const filename = `${this.imagesCount}.${ext}`;
    const localFileId = `${this.imagesCount}`;
    this.formData.append(`Files[${localFileId}][LocalFileId]`, localFileId);
    this.formData.append(`Files[${localFileId}][Title]`, filename);
    this.formData.append(`Files[${localFileId}][Type]`, blob.type);
    this.formData.append(`Files[${localFileId}][HasBody]`, 'true');
    this.imagesCount++;
    this.formData.append(`FileDatas[${localFileId}]`, blob, filename);
    return `${this.config.leanote_host}/api/file/getImage?fileId=${localFileId}`;
  };

  /**
   * Perform a GET in login api
   *
   * @see documentation https://github.com/leanote/leanote/wiki/leanote-api
   */
  login = async () => {
    if (!this.config.email || !this.config.pwd || this.config.email === '') {
      throw new Error('Cannot login');
    }
    const data = await this.request.get<LeanoteResponse>(
      `/api/auth/login?email=${this.config.email}&pwd=${this.config.pwd}`
    );
    this.config.token_cached = data.Token;
    return data.Token;
  };

  /**
   * Perform a GET in getSyncNotebooks api to find notebooks
   *
   * @see documentation https://github.com/leanote/leanote/wiki/leanote-api
   */
  getSyncNotebooks = async () => {
    return this.request.get<LeanoteNotebook[]>(
      `/api/notebook/getSyncNotebooks?token=${this.config.token_cached}`
    );
  };
}
