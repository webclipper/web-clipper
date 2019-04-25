import {
  Repository,
  ServiceMeta,
  ImageHostingServiceMeta,
} from '../../../common/backend';
import { SerializedExtensionWithId } from '../../../extensions/interface';

export interface UserPreferenceStore {
  accounts: AccountPreference[];
  imageHosting: ImageHosting[];
  defaultPluginId?: string | null;
  defaultAccountId?: string;
  showQuickResponseCode: boolean;
  showLineNumber: boolean;
  liveRendering: boolean;
  initializeForm: {
    repositories: Repository[];
    userInfo?: {
      name: string;
      avatar: string;
      homePage: string;
      description?: string;
    };
    verifying: boolean;
    verified: boolean;
  };
  servicesMeta: {
    [type: string]: ServiceMeta;
  };
  imageHostingServicesMeta: {
    [type: string]: ImageHostingServiceMeta;
  };
  extensions: SerializedExtensionWithId[];
}

export interface AccountPreference {
  id: string;
  type: string;
  name: string;
  avatar: string;
  homePage: string;
  description?: string;
  defaultRepositoryId?: string;
  imageHosting?: string;
  [key: string]: string | undefined;
}

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

export interface CompleteStatus {
  /** 裁剪成功后的文章地址 */
  documentHref: string;
  documentId: string;
  repositoryId: string;
}
