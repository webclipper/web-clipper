import { CompleteStatus, CreateDocumentRequest } from './../interface';
import { Repository } from '../interface';

export enum RepositoryType {
  all = 'all',
  self = 'self',
  group = 'group',
}

export interface YuqueBackendServiceConfig {
  access_token: string;
  repositoryType: RepositoryType;
}

export interface YuqueUserInfoResponse {
  id: number;
  avatar_url: string;
  name: string;
  login: string;
  description: string;
}

export interface YuqueGroupResponse {
  id: number;
  name: string;
  login: string;
}

export interface YuqueRepository extends Repository {
  namespace: string;
}

export interface YuqueRepositoryResponse {
  id: number;
  name: string;
  namespace: string;
}

export interface YuqueCreateDocumentResponse {
  id: number;
  slug: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface YuqueCompleteStatus extends CompleteStatus {
  documentId: string;
  repositoryId: string;
}

export interface YuqueCreateDocumentRequest extends CreateDocumentRequest {
  slug?: string;
}
