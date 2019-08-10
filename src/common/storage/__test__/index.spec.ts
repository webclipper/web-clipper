import { PreferenceStorage, TypedCommonStorageInterface, CommonStorage } from './../interface';
import { AccountPreference } from '@/common/types';
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
    accounts: [],
    imageHosting: [],
    defaultAccountId: undefined,
    defaultPluginId: undefined,
    showLineNumber: true,
    liveRendering: true,
  };

  beforeEach(() => {
    storage = new TypedCommonStorage(new MockStorage());
  });

  it('The default value should be correct', async () => {
    expect(await storage.getPreference()).toEqual(defaultPreference);
    expect(await storage.getAccounts()).toEqual(defaultPreference.accounts);
    expect(await storage.getDefaultAccountId()).toEqual(defaultPreference.defaultAccountId);
    expect(await storage.getDefaultPluginId()).toEqual(defaultPreference.defaultPluginId);
    expect(await storage.getShowLineNumber()).toEqual(defaultPreference.showLineNumber);
    expect(await storage.getLiveRendering()).toEqual(defaultPreference.liveRendering);
  });

  describe('config account should work correctly', () => {
    const mockGithubAccount: AccountPreference = {
      id: 'github',
      type: 'github',
      name: 'DiamondYuan',
      avatar: 'avatar',
      homePage: 'homePage',
      host: 'https://github.com',
    };

    const mockYuqueAccount: AccountPreference = {
      type: 'yuque',
      accessToken: 'yuque',
      id: 'yuque',
      name: 'DiamondYuan',
      host: 'https://yuque.com',
      avatar: 'avatar',
      homePage: 'homePage',
    };

    const mockGitlabAccount: AccountPreference = {
      type: 'gitlab',
      accessToken: 'gitlab',
      id: 'gitlab',
      name: 'DiamondYuan',
      host: 'https://gitlab.com',
      avatar: 'avatar',
      homePage: 'homePage',
    };

    it('test add account should change defaultAccountId when defaultAccountId is undefined', async () => {
      await storage.addAccount(mockGithubAccount);
      await storage.addAccount(mockYuqueAccount);
      await storage.addAccount(mockGitlabAccount);
      expect(await storage.getDefaultAccountId()).toBe(mockGithubAccount.id);
      expect((await storage.getAccounts()).length).toBe(3);
    });
    describe('test delete account', () => {
      it('defaultAccountId will be undefined if there are no account', async () => {
        await storage.addAccount(mockGithubAccount);
        await storage.deleteAccountById(mockGithubAccount.id);
        expect(await storage.getDefaultAccountId()).toBe(undefined);
      });
      it('account amount will be correctly', async () => {
        await storage.addAccount(mockGithubAccount);
        await storage.addAccount(mockYuqueAccount);
        await storage.deleteAccountById(mockGithubAccount.id);
        expect((await storage.getAccounts()).length).toBe(1);
      });
      it('defaultAccountId will be account id of first account if default account is delete', async () => {
        await storage.addAccount(mockGithubAccount);
        await storage.addAccount(mockYuqueAccount);
        await storage.deleteAccountById(mockGithubAccount.id);
        expect(await storage.getDefaultAccountId()).toBe(mockYuqueAccount.id);
      });
    });
    it('Do not allow duplicate accounts', async () => {
      await storage.addAccount(mockGithubAccount);
      expect((await storage.getAccounts()).length).toBe(1);
      try {
        await storage.addAccount(mockGithubAccount);
      } catch (error) {
        expect(error.message).toBe('Do not allow duplicate accounts');
        expect((await storage.getAccounts()).length).toBe(1);
      }
    });
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
