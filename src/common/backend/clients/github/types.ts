import { IRequestService } from '@/service/common/request';

export interface IGithubClientOptions {
  token: string;
  request: IRequestService;
}
export interface ICreateIssueOptions {
  title: string;
  body: string;
  labels: string[];
  namespace: string;
}

export interface ICreateIssueResponse {
  html_url: string;
  id: number;
}

export interface IGithubUserInfoResponse {
  avatar_url: string;
  name: string;
  bio: string;
  html_url: string;
}

export interface IUploadFileOptions {
  owner: string;
  repo: string;
  path: string;
  message: string;
  content: string;
  branch?: string;
}

export interface IUploadFileResponse {
  content: {
    html_url: string;
  };
}
