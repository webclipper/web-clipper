import { PreferenceStorage, TypedCommonStorageInterface, CommonStorage } from './../interface';
/* eslint-disable max-nested-callbacks */
/* eslint-disable no-undefined */
import update from 'immutability-helper';
import { TypedCommonStorage } from '../typedCommonStorage';

class MockStorage implements CommonStorage {
  private data: any;
  constructor() {
    this.data = {};
  }

  get = (key: string) => {
    return this.data[key];
  };

  set = (key: string, item: Object) => {
    this.data[key] = item;
  };
}

describe('test storage', () => {
  let storage: TypedCommonStorageInterface;
  const defaultPreference: PreferenceStorage = {
    imageHosting: [],
    defaultPluginId: undefined,
    showLineNumber: true,
    liveRendering: true,
    iconColor: 'auto',
  };

  beforeEach(() => {
    storage = new TypedCommonStorage(new MockStorage());
  });

  it('The default value should be correct', async () => {
    expect(await storage.getPreference()).toEqual(defaultPreference);
    expect(await storage.getDefaultPluginId()).toEqual(defaultPreference.defaultPluginId);
    expect(await storage.getShowLineNumber()).toEqual(defaultPreference.showLineNumber);
    expect(await storage.getLiveRendering()).toEqual(defaultPreference.liveRendering);
  });

  it('setDefaultPluginId should work correctly', async () => {
    for (const value of ['11', '22', 'data', null]) {
      await storage.setDefaultPluginId(value);
      expect(await storage.getDefaultPluginId()).toBe(value);
      expect(await storage.getPreference()).toEqual(
        update(defaultPreference, {
          defaultPluginId: {
            $set: value,
          },
        })
      );
    }
  });

  it('setShowLineNumber should work correctly', async () => {
    for (const value of [true, false, true]) {
      await storage.setShowLineNumber(value);
      expect(await storage.getShowLineNumber()).toBe(value);
      expect(await storage.getPreference()).toEqual(
        update(defaultPreference, {
          showLineNumber: {
            $set: value,
          },
        })
      );
    }
  });

  it('setLiveRendering should work correctly', async () => {
    for (const value of [true, false, true]) {
      await storage.setLiveRendering(value);
      expect(await storage.getLiveRendering()).toBe(value);
      expect(await storage.getPreference()).toEqual(
        update(defaultPreference, {
          liveRendering: {
            $set: value,
          },
        })
      );
    }
  });
});
