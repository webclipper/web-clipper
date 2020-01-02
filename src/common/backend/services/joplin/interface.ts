import { CreateDocumentRequest } from './../interface';
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

export interface JoplinCreateDocumentRequest extends CreateDocumentRequest {
  tags: string[];
}
