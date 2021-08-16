import { Token } from 'typedi';

export interface IBackendService {
  refreshToken(): Promise<string>;
}

export const IBackendService = new Token<IBackendService>();
