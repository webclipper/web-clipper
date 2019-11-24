import { Repository, CreateDocumentRequest } from '../interface';

export interface GithubBackendServiceConfig {
  accessToken: string;
  visibility: string;
}

export interface GithubCreateDocumentRequest extends CreateDocumentRequest {
  labels: string[];
}

export interface GithubUserInfoResponse {
  avatar_url: string;
  name: string;
  bio: string;
  html_url: string;
}

export interface GithubRepository extends Repository {
  namespace: string;
}

export interface GithubRepositoryResponse {
  id: number;
  name: string;
  full_name: string;
  created_at: string;
  description: string;
  private: boolean;
}

export interface GithubLabel {
  color: string;
  description: string;
  name: string;
  default: boolean;
}
