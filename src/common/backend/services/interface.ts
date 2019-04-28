export interface DocumentServiceConstructAble {
  new (info: any): DocumentService;
}

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
   * 后端服务名称
   */
  name: string;
  /**
   * 图标
   */
  icon: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 后端接口实现
   */
  service: DocumentServiceConstructAble;
  /**
   * 主页
   */
  homePage: string;
  /**
   * 配置表单
   */
  form?: any;
  complete?: any;
}

export interface DocumentService {
  getId(): string;

  getRepositories(): Promise<Repository[]>;

  createDocument(request: CreateDocumentRequest): Promise<CompleteStatus>;

  getUserInfo(): Promise<UserInfo>;
}
