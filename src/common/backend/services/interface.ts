export interface DocumentServiceConstructAble {
  new (info: any): DocumentService;
}

export interface DocumentService {
  getRepositories(): Promise<Repository[]>;

  createDocument(
    request: CreateDocumentRequest
  ): Promise<CreateDocumentResponse>;

  getUserInfo(): Promise<UserInfo>;
}

export interface CreateDocumentRequest {
  title: string;
  content: string;
  private: boolean;
  repositoryId: string;
  tags?: string[];
}
export interface CreateDocumentResponse {
  href: string;
  repositoryId: string;
  documentId: string;
}

export interface UserInfo {
  name: string;
  avatar: string;
  homePage: string;
  description?: string;
}

export interface Repository {
  id: string;
  name: string;
  private: boolean;
  createdAt: string;
  owner: string;
  /**
   * namespace = owner/name
   */
  namespace: string;
}

export interface ServiceMeta {
  name: string;
  icon: string;
  type: string;
  service: DocumentServiceConstructAble;
  homePage: string;
  form: any;
}
