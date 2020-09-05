import { CreateDocumentRequest } from '../interface';

export interface WizNoteConfig {
  origin: string;
  spaceId: number;
}

export interface WizNoteUserInfo {
  result: {
    email: string;
    userGuid: string;
    displayName: string;
    token: string;
    kbGuid: string;
  };
}

export interface WizNoteCreateDocumentRequest extends CreateDocumentRequest {
  tags: string[];
}

export interface WizNoteCreateTagResponse {
  result: {
    tagGuid: string;
  };
}

export interface WizNoteGetTagsResponse {
  result: {
    id: string;
    name: string;
    tagGuid: string;
  }[];
}

export interface WizNoteGetRepositoriesResponse {
  result: string[];
}
