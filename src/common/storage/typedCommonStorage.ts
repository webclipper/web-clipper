import { ImageHosting } from '@/common/types';
import { TypedCommonStorageInterface, CommonStorage, PreferenceStorage } from './interface';

const keysOfStorage = {
  accounts: 'accounts',
  defaultAccountId: 'defaultAccountId',
  defaultPluginId: 'defaultPluginId',
  showQuickResponseCode: 'showQuickResponseCode',
  liveRendering: 'liveRendering',
  showLineNumber: 'showLineNumber',
  imageHosting: 'imageHosting',
  iconColor: 'iconColor',
};

export class TypedCommonStorage implements TypedCommonStorageInterface {
  store: CommonStorage;

  constructor(store: CommonStorage) {
    this.store = store;
  }

  getPreference = async (): Promise<PreferenceStorage> => {
    const defaultPluginId = await this.getDefaultPluginId();
    const showLineNumber = await this.getShowLineNumber();
    const liveRendering = await this.getLiveRendering();
    const imageHosting = await this.getImageHosting();
    const iconColor = await this.getIconColor();
    return {
      defaultPluginId,
      showLineNumber,
      liveRendering,
      imageHosting,
      iconColor,
    };
  };

  setDefaultPluginId = async (value: string | null) => {
    await this.store.set(keysOfStorage.defaultPluginId, value);
  };
  getDefaultPluginId = async () => {
    return this.store.get<string>(keysOfStorage.defaultPluginId);
  };

  setShowLineNumber = async (value: boolean) => {
    await this.store.set(keysOfStorage.showLineNumber, value);
  };
  getShowLineNumber = async () => {
    const value = await this.store.get<boolean>(keysOfStorage.showLineNumber);
    return value !== false;
  };

  setLiveRendering = async (value: boolean) => {
    await this.store.set(keysOfStorage.liveRendering, value);
  };
  getLiveRendering = async () => {
    const value = await this.store.get<boolean>(keysOfStorage.liveRendering);
    return value !== false;
  };

  setIconColor = async (value: string) => {
    await this.store.set(keysOfStorage.iconColor, value);
  };
  getIconColor = async () => {
    const value = await this.store.get<'dark' | 'light' | 'auto'>(keysOfStorage.iconColor);
    return value ?? 'auto';
  };

  addImageHosting = async (imageHosting: ImageHosting) => {
    const imageHostingList = await this.getImageHosting();
    if (imageHostingList.some(o => o.id === imageHosting.id)) {
      throw new Error('Do not allow duplicate image hosting');
    }
    imageHostingList.push(imageHosting);
    await this.store.set('imageHosting', imageHostingList);
    return imageHostingList;
  };

  getImageHosting = async () => {
    const value = await this.store.get<ImageHosting[]>('imageHosting');
    if (!value) {
      return [];
    }
    return value;
  };

  deleteImageHostingById = async (id: string) => {
    const imageHostingList = await this.getImageHosting();
    const newImageHostingList = imageHostingList.filter(imageHosting => imageHosting.id !== id);
    await this.store.set(keysOfStorage.imageHosting, newImageHostingList);
    return newImageHostingList;
  };

  editImageHostingById = async (id: string, value: ImageHosting) => {
    const imageHostingList = await this.getImageHosting();
    const index = imageHostingList.findIndex(imageHosting => imageHosting.id === id);
    if (index < 0) {
      throw new Error('图床不存在');
    }
    imageHostingList[index] = value;
    await this.store.set('imageHosting', imageHostingList);
    return imageHostingList;
  };
}
