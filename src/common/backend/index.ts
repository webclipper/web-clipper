export interface ImageHostingService {
  uploadImage(request: UploadImageRequest): Promise<string>;

  uploadImageUrl(url: string): Promise<string>;
}

export interface DocumentService {
  getRepositories(): Promise<Repository[]>;

  createDocument(
    request: CreateDocumentRequest
  ): Promise<CreateDocumentResponse>;

  getUserInfo(): Promise<UserInfo>;
}

export interface Repository {
  id: string;
  name: string;
  private: boolean;
  description: string;
  createdAt: string;
  owner: string;
  /**
   * namespace = owner/name
   */
  namespace: string;
}

export interface UserInfo {
  name: string;
  avatar: string;
  homePage: string;
  description?: string;
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

export interface CreateRepositoryRequest {
  name: string;
  private: boolean;
}

interface UploadImageRequest {
  data: string;
}
