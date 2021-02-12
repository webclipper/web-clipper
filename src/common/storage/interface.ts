import { ImageHosting } from 'common/types';
export interface PreferenceStorage {
  imageHosting: ImageHosting[];
  defaultPluginId?: string | null;
  showLineNumber: boolean;
  liveRendering: boolean;
  iconColor: 'dark' | 'light' | 'auto';
}

export interface CommonStorage {
  set(key: string, value: any): void | Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
}

export interface TypedCommonStorageInterface {
  getPreference(): Promise<PreferenceStorage>;

  /** --------默认插件--------- */

  setDefaultPluginId(id: string | null): Promise<void>;

  getDefaultPluginId(): Promise<string | undefined | null>;

  /** --------编辑器显示行号--------- */

  setShowLineNumber(value: boolean): Promise<void>;

  getShowLineNumber(): Promise<boolean>;

  /** --------实时渲染--------- */
  setLiveRendering(value: boolean): Promise<void>;

  getLiveRendering(): Promise<boolean>;

  setIconColor(value: string): Promise<void>;

  getIconColor(): Promise<string>;

  /** --------图床--------- */

  addImageHosting(imageHosting: ImageHosting): Promise<ImageHosting[]>;

  getImageHosting(): Promise<ImageHosting[]>;

  deleteImageHostingById(id: string): Promise<ImageHosting[]>;

  editImageHostingById(id: string, value: ImageHosting): Promise<ImageHosting[]>;
}
