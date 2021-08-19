import { IBackendService } from './../services/backend/common/backend';
import { IStorageService } from '@web-clipper/shared/lib/storage';
import { ILocalStorageService } from '@/service/common/storage';
import {
  IPowerpackService,
  PowerpackUserInfo as _PowerpackUserInfo,
} from '@/service/common/powerpack';
import { Inject } from 'typedi';
import { observable, runInAction, computed } from 'mobx';
import dayjs from 'dayjs';
import { loading } from '@/common/loading';

type PowerpackUserInfo = _PowerpackUserInfo;

export class PowerpackService implements IPowerpackService {
  static LOCAL_ACCESS_TOKEN_LOCALE_KEY: string = 'local.access.token.locale';

  @observable
  public userInfo: PowerpackUserInfo | null = null;

  @observable
  public accessToken?: string;

  @computed get bought() {
    return !!this.userInfo;
  }

  @computed get expired() {
    return (
      this.bought &&
      !dayjs(this.userInfo!.expire_date, 'YYYY-MM-DD')
        .endOf('day')
        .add(1, 'day')
        .isAfter(dayjs())
    );
  }

  constructor(
    @Inject(ILocalStorageService) private localStorageService: IStorageService,
    @Inject(IBackendService) private backendService: IBackendService
  ) {
    this.localStorageService.onDidChangeStorage(key => {
      if (key === PowerpackService.LOCAL_ACCESS_TOKEN_LOCALE_KEY) {
        this.startup();
      }
    });
  }

  @loading
  startup = async () => {
    const accessToken = this.localStorageService.get(
      PowerpackService.LOCAL_ACCESS_TOKEN_LOCALE_KEY
    );
    if (!accessToken) {
      runInAction(() => {
        this.accessToken = accessToken;
        this.userInfo = null;
      });
      return;
    }
    runInAction(() => {
      this.accessToken = accessToken;
    });
    const response: PowerpackUserInfo = await this.backendService.getUserInfo();
    runInAction(() => {
      this.userInfo = response;
    });
  };

  @loading
  refresh = async () => {
    const response = await this.backendService.refreshToken();
    await this.localStorageService.set(PowerpackService.LOCAL_ACCESS_TOKEN_LOCALE_KEY, response);
  };

  logout = async () => {
    this.localStorageService.delete(PowerpackService.LOCAL_ACCESS_TOKEN_LOCALE_KEY);
  };

  login = async (token: string) => {
    this.localStorageService.set(PowerpackService.LOCAL_ACCESS_TOKEN_LOCALE_KEY, token);
  };
}
