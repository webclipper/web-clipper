import { CreateDocumentRequest } from './../interface';
import locales from '@/common/locales';

export const VisibilityType = [
  { label: () => locales.format({ id: 'backend.services.memos.headerForm.VisibilityType.private', defaultMessage: 'private' }), value: 'PRIVATE' },
  { label: () => locales.format({ id: 'backend.services.memos.headerForm.VisibilityType.public', defaultMessage: 'public' }), value: 'PUBLIC' },
] as const;

export type VisibilityType = typeof VisibilityType[number];

export interface MemosBackendServiceConfig {
  accessToken: string;
  origin: string;
}

export interface MemosUserResponse {
  name: string;
  username: string;
  email: string;
  avatarUrl: string;
  description: string;
}

export interface MemosUserInfo {
  name: string;
  avatar: string;
  homePage: string;
  description: string;
}

export interface MemoCreateDocumentRequest extends CreateDocumentRequest {
	visibility?: VisibilityType;
	tags?: string;
}
