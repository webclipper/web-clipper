export interface FeishuBackendServiceConfig {
  workerUrl: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number; // timestamp in seconds
}

export interface FeishuUserInfoResponse {
  code: number;
  msg: string;
  data: {
    avatar_url: string;
    name: string;
    open_id: string;
    union_id: string;
  };
}

export interface FeishuCreateDocumentRequest {
  title: string;
  content: string;
  repositoryId: string;
}

export interface FeishuCompleteStatus {
  href: string;
  repositoryId: string;
  documentId: string;
}

export interface FeishuTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

