export interface CreateDocumentRequest {
  title: string;
  content: string;
  url?: string;
  repositoryId: string;
}

export interface CompleteStatus {
  href?: string;
}

export interface UserInfo {
  name: string;
  avatar: string;
  homePage?: string;
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
  disabled?: boolean;
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
  headerForm?: any;
  permission?: chrome.permissions.Permissions;
}

export interface DocumentService<T = any> {
  getId(): string;

  getRepositories(): Promise<Repository[]>;

  createDocument(request: CreateDocumentRequest): Promise<CompleteStatus | void>;

  getUserInfo(): Promise<UserInfo>;

  refreshToken?(info: T): Promise<T>;
}

interface ErrorOptions {
  message: string;
}

class BaseError<T extends ErrorOptions> extends Error {
  protected options?: T;

  constructor(options?: T) {
    super();
    this.options = options || ({} as T);
    this.message = this.options.message || '';
    this.name = this.constructor.name;
  }

  public static from(err: Error): BaseError<ErrorOptions> {
    const ErrorClass = this;
    const newErr = new ErrorClass<ErrorOptions>();
    newErr.message = err.message;
    newErr.stack = err.stack;
    return newErr;
  }
}

interface HttpErrorOptions extends ErrorOptions {
  status: number;
}

export class HttpError extends BaseError<HttpErrorOptions> {
  public status: number;
  protected options: HttpErrorOptions;

  constructor(options: HttpErrorOptions) {
    super(options);
    this.options = options;
    this.status = this.options.status;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message?: string) {
    const status = 401;
    super({ message: message || 'Unauthorized', status });
  }
}
