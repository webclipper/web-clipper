export interface ConfluenceListResult<T> {
  results: T[];
  start: number;
  limit: number;
  size: number;
}

export interface ConfluenceSpace {
  id: number;
  name: string;
  type: string;
  _expandable: {
    homepage?: string;
  };
}

export interface ConfluencePage {
  id: string;
  title: string;
  type: string;
}

export interface ConfluenceServiceConfig {
  origin: string;
  spaceId: number;
}

export interface ConfluenceSpace {
  id: number;
  name: string;
  type: string;
}

export interface ConfluenceUserInfo {
  displayName: string;
  profilePicture: {
    path: string;
  };
}

/**
 * Response of rest/api/content/:id
 */
export interface ConfluenceSpaceContent {
  space: {
    key: string;
    id: number;
    name: string;
  };
}
