export interface CreateDocumentRequest {
  title: string;
  content: string;
  repositoryId: string;
}

export interface CompleteStatus {
  href: string;
}

export interface UserInfo {
  name: string;
  avatar: string;
  homePage: string;
  description?: string;
}

export interface Repository {
  /**
   * 仓库 ID
   */
  id: string;
  /**
   * 仓库名
   */
  name: string;
  /**
   * 团队 ID
   */
  groupId: string;
  /**
   * 团队 名称
   */
  groupName: string;
}

export interface ServiceMeta {
  /**
   * Name of Backend Service
   */
  name: string;
  /**
   * icon
   */
  icon: string;
  /**
   * Type of Backend Service
   */
  type: string;
  /**
   * Backend Service
   */
  service: Type<DocumentService>;
  /**
   * 主页
   */
  homePage?: string;
  /**
   * 配置表单
   */
  form?: any;
  complete?: any;
  oauthUrl?: string;
}

export interface DocumentService {
  getId(): string;

  getRepositories(): Promise<Repository[]>;

  createDocument(request: CreateDocumentRequest): Promise<CompleteStatus>;

  getUserInfo(): Promise<UserInfo>;
}
