import { AxiosInstance } from 'axios';
import * as qs from 'qs';
import { DocumentPublicType } from '../../enums';
import { UUID } from '../utils/uuid';

export interface DocumentDetail {
  id: number;
  slug: string;
  title: string;
  body: string;
  body_asl: string;
  body_html: string;
  public: DocumentPublicType;
  created_at: string;
  updated_at: string;
}

export interface PostDocRequest {
  title: string;
  slug?: string;
  public?: DocumentPublicType;
  body: string;
}

export interface UpdateDocRequest {
  title: string;
  slug: string;
  public: DocumentPublicType;
  body: string;
}

export interface DocumentService {
  getDocumentsList(repoIdentity: string | number): Promise<DocumentDetail[]>;

  getDocumentDetail(repoIdentity: string | number, documentIdentity: string | number): Promise<DocumentDetail>;

  createDocument(repoIdentity: string | number, postDocRequest: PostDocRequest): Promise<DocumentDetail>;

  deleteDocument(repoIdentity: string | number, documentIdentity: string | number): Promise<void>;

  updateDocument(repoIdentity: string | number, documentIdentity: string | number, updateDocRequest: UpdateDocRequest): Promise<void>;
}

export class DocumentServiceImpl implements DocumentService {

  private request: AxiosInstance;

  constructor(req: AxiosInstance) {
    this.request = req;
  }
  public async getDocumentsList(repoIdentity: string | number) {
    return this.request.get(`repos/${repoIdentity}/docs`)
      .then((re) => {
        return Promise.resolve(re.data);
      }).catch((err) => {
        return Promise.reject(err);
      });
  }

  public async getDocumentDetail(repoIdentity: string | number, documentIdentity: string | number) {
    return this.request.get(`/repos/${repoIdentity}/docs/${documentIdentity}?raw=1`)
      .then((re) => {
        return Promise.resolve(re.data as DocumentDetail);
      }).catch((err) => {
        return Promise.reject(err);
      });
  }

  public async createDocument(repoIdentity: string | number, postDocRequest: PostDocRequest) {
    if (postDocRequest) {
      if (!postDocRequest.slug) {
        postDocRequest.slug = UUID.UUID();
      }
      if (!postDocRequest.public) {
        postDocRequest.public = DocumentPublicType.PRIVATE;
      }
    }
    return this.request.post(`/repos/${repoIdentity}/docs`, qs.stringify(postDocRequest))
      .then((re) => {
        return Promise.resolve(re.data);
      }).catch((err) => {
        return Promise.reject(err);
      });
  }

  public async deleteDocument(repoIdentity: string | number, documentIdentity: string | number) {
    return this.request.delete(`/repos/${repoIdentity}/docs/${documentIdentity}`)
      .then((_) => {
        return Promise.resolve();
      }).catch((err) => {
        return Promise.reject(err);
      });
  }

  public async updateDocument(repoIdentity: string | number, documentIdentity: string | number, updateDocRequest: UpdateDocRequest) {
    return this.request.put(`/repos/${repoIdentity}/docs/${documentIdentity}`, qs.stringify(updateDocRequest))
      .then((re) => {
        return Promise.resolve(re.data);
      }).catch((err) => {
        return Promise.reject(err);
      });
  }

}
