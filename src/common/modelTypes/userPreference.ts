import { ServiceMeta, ImageHostingServiceMeta } from '@/common/backend';

export interface UserPreferenceStore {
  locale: string;
  imageHosting: ImageHosting[];
  liveRendering: boolean;
  iconColor: 'dark' | 'light' | 'auto';
  servicesMeta: {
    [type: string]: ServiceMeta;
  };
  imageHostingServicesMeta: {
    [type: string]: ImageHostingServiceMeta;
  };
}

/**
 * 图床配置的数据结构
 */
export interface ImageHosting {
  id: string;
  type: string;
  remark?: string;
  info?: {
    [key: string]: string;
  };
}

export interface ImageClipperData {
  dataUrl: string;
  width: number;
  height: number;
}

export type ClipperDataType = string | ImageClipperData;

export const LOCAL_USER_PREFERENCE_LOCALE_KEY = 'local.userPreference.locale';

/**
 * user Access Tiken
 */
export const LOCAL_ACCESS_TOKEN_LOCALE_KEY = 'local.access.token.locale';
