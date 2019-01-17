interface Repository {
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

interface UserInfoResponse {
  name: string;
  avatar: string;
  homePage: string;
}

interface CreateDocumentRequest {
  title: string;
  content: string;
  private: boolean;
  repositoryId: string;
}

interface CreateRepositoryRequest {
  name: string;
  private: boolean;
}

interface UploadImageRequest {
  data: string;
}

interface ImageService {
  uploadImage(request: UploadImageRequest): Promise<void>;
}

interface BackendService {
  getRepositories(): Promise<Repository[]>;

  createRepository(request: CreateRepositoryRequest): Promise<void>;

  createDocument(request: CreateDocumentRequest): Promise<void>;

  getUserInfo(): Promise<UserInfoResponse>;
}
