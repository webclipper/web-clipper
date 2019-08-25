import { ServiceMeta, ImageHostingServiceMeta } from '@/common/backend';

export interface UserPreferenceStore {
  locale: string;
  remoteVersion?: string;
  imageHosting: ImageHosting[];
  showLineNumber: boolean;
  liveRendering: boolean;
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
