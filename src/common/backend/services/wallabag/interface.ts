export interface WallabagBackendServiceConfig {
  access_token: string;
  refresh_token: string;
  client_id: string;
  client_secret: string;
  origin: string;
}

export interface WallabagTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface WallabagUserInfoResponse {
  username: string;
}
export interface WallabagCreateDocumentResponse {
  id: string;
  _links: {
    self: {
      href: string;
    };
  };
}
