import { Token } from 'typedi';

export interface IBackendService {
  refreshToken(): Promise<string>;
  sendEmail(data: PostMailRequestBody): Promise<void>;
  fetchRemoteConfig(): Promise<WebClipperRemoteConfig>;
}

export const IBackendService = new Token<IBackendService>();

export interface WebClipperRemoteConfig {
  yuque_oauth: {
    clientId: string;
    callback: string;
    scope: string;
  };
}

export interface PostMailRequestBody {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}
