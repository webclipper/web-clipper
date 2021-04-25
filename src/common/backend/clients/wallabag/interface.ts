export interface WallabagBackendServiceConfig {
  access_token: string;
  refresh_token: string;
  client_id: string;
  client_secret: string;
  wallabag_host: string;
}

export interface WallabagRefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface WallabagUserInfoResponse {
  username: string;
  id: string;
}

export interface WallabagCreateDocumentResponse {
  id: string;
}
