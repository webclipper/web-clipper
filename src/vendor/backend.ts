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

interface UserInfo {
  name: string;
  avatar: string;
  homePage: string;
}

interface CreateDocumentRequest {
  title: string;
  content: string;
  private: boolean;
  repositoryId: string;
  tags?: string[];
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

interface DocumentServiceAbility {
  document: {
    label: boolean;
    settingPermissions: boolean;
  };
}

interface DocumentService {
  getRepositories(): Promise<Repository[]>;

  createRepository(request: CreateRepositoryRequest): Promise<void>;

  createDocument(request: CreateDocumentRequest): Promise<string>;

  getUserInfo(): Promise<UserInfo>;

  getAbility(): Promise<DocumentServiceAbility>;
}
