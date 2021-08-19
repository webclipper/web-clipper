import { PowerpackUserInfo } from '@/service/common/powerpack';
import { Token } from 'typedi';

export interface IBackendService {
  refreshToken(): Promise<string>;
  sendEmail(data: PostMailRequestBody): Promise<void>;
  fetchRemoteConfig(): Promise<WebClipperRemoteConfig>;
  getUserInfo(): Promise<PowerpackUserInfo>;
  ocr(data: OCRRequestBody): Promise<string>;
  sentToKindle(data: SendToKindleRequestBody): Promise<void>;
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

export interface SendToKindleRequestBody {
  to: string;
  title: string;
  content: string;
}

export interface OCRRequestBody {
  image: string;
  language_type: 'CHN_ENG' | 'ENG' | 'JAP' | 'GER';
}
