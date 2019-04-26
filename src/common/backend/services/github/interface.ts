import { Repository } from '../interface';

export interface GithubBackendServiceConfig {
  accessToken: string;
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
