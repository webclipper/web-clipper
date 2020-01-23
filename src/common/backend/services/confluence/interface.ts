export interface FetchConfluenceSpaceResponse {
  results: ConfluenceSpace[];
}

export interface ConfluenceSpace {
  id: number;
  name: string;
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
