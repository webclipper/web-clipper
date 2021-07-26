import { Repository, CreateDocumentRequest } from '../../services/interface';

export { Repository } from '../../services/interface';
export { CreateDocumentRequest } from '../../services/interface';

export interface IJoplinClient {
  getTags(filterTags: boolean): Promise<JoplinTag[]>;
  getRepositories(): Promise<Repository[]>;
  createDocument(data: JoplinCreateDocumentRequest): Promise<void>;
  uploadBlob(blob: Blob): Promise<string>;
}

export interface JoplinTag {
  id: string;
  title: string;
}

export interface JoplinCreateDocumentRequest extends CreateDocumentRequest {
  tags: string[];
}

export interface JoplinBackendServiceConfig {
  token: string;
  filterTags: boolean;
}

export interface JoplinFolderItem {
  id: string;
  title: string;
  children: JoplinFolderItem[];
}

export interface JoplinTag {
  id: string;
  title: string;
}

export interface IJoplinClient {
  getTags(filterTags: boolean): Promise<JoplinTag[]>;
  getRepositories(): Promise<Repository[]>;
  createDocument(data: JoplinCreateDocumentRequest): Promise<void>;
}

export interface JoplinCreateDocumentRequest extends CreateDocumentRequest {
  tags: string[];
}

export interface IPageRes<T> {
  has_more: boolean;
  items: T[];
}
