import { CompleteStatus } from 'common/backend/interface';
import { DocumentService, CreateDocumentRequest } from '../../index';
import axios, { AxiosInstance } from 'axios';
import showdown from 'showdown';
import { LeanoteBackendServiceConfig, LeanoteNotebook, LeanoteResponse } from './interface';

const converter = new showdown.Converter();
/**
 * Document service for self hosted leanote or leanote.com
 *
 */
export default class LeanoteDocumentService implements DocumentService {
  private config: LeanoteBackendServiceConfig;
  private request: AxiosInstance;
  private formData: FormData;
  private imagesCount: number;

  /**
   * This extension will need the user and password to connect to leanote and fetch a token
   * You must supply the one of your leanote server.
   */
  constructor({ leanote_host, email, pwd, html, token_cached }: LeanoteBackendServiceConfig) {
    this.config = { leanote_host, email, pwd, html, token_cached };
    this.formData = new FormData();
    this.imagesCount = 0;
    this.request = axios.create({
      baseURL: this.config.leanote_host,
      timeout: 3000,
      transformResponse: [data => JSON.parse(data)],
    });
  }

  getId = () => {
    return this.config.email;
  };

  getUserInfo = async () => {
    return {
      name: 'leanote',
      avatar: '',
      homePage: this.config.leanote_host,
      description: `send to ${this.config.email} account on leanote`,
    };
  };

  /**
   * Use the leanote api to fetch notebook as repository
   *
   * @see documentation https://github.com/leanote/leanote/wiki/leanote-api
   */
  getRepositories = async () => {
    let response = await this._getSyncNotebooks();
    if (response.data.Msg && response.data.Msg === 'NOTLOGIN') {
      await this._login();
      response = await this._getSyncNotebooks();
    }
    return response.data.map(function(leanoteNotebook: LeanoteNotebook) {
      return {
        id: leanoteNotebook.NotebookId,
        name: leanoteNotebook.Title,
        groupId: 'leanote',
        groupName: 'leanote',
      };
    });
  };

  /**
   * Use the leanote api to clip document as note in leanote
   *
   * @see documentation https://github.com/leanote/leanote/wiki/leanote-api
   */
  createDocument = async (info: CreateDocumentRequest): Promise<CompleteStatus> => {
    this.formData.append('NotebookId', info.repositoryId);
    this.formData.append('Title', info.title);
    this.formData.append('Content', converter.makeHtml(info.content));
    const formData = this.formData;
    this.formData = new FormData();
    this.imagesCount = 0;
    await this.request.post<LeanoteResponse>('/api/note/addNote', formData, {
      params: {
        token: this.config.token_cached,
      },
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
    return {
      href: `${this.config.leanote_host}`,
    };
  };

  /**
   * Use the leanote api to embed image in the document as note in leanote
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

  _login = async () => {
    if (!this.config.email || !this.config.pwd || this.config.email === '') {
      throw new Error('Cannot login');
    }
    const response = await this.request.get<LeanoteResponse>('/api/auth/login', {
      params: {
        email: this.config.email,
        pwd: this.config.pwd,
      },
    });
    const { data } = response;
    this.config.token_cached = data.Token;
  };

  _getSyncNotebooks = () => {
    return this.request.get<LeanoteNotebook[]>('/api/notebook/getSyncNotebooks', {
      params: {
        token: this.config.token_cached,
      },
    });
  };
}
