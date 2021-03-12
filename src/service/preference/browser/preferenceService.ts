import { Inject, Service } from 'typedi';
import { observable } from 'mobx';
import { ISyncStorageService } from '@/service/common/storage';
import { IStorageService } from '@web-clipper/shared/lib/storage';
import { IPreferenceService, IUserPreference, TIconColor } from '@/service/common/preference';

class PreferenceService implements IPreferenceService {
  @observable
  public userPreference: IUserPreference = {
    iconColor: 'auto',
  };

  constructor(@Inject(ISyncStorageService) private syncStorageService: IStorageService) {
    this.syncStorageService.onDidChangeStorage(e => {
      if (e === 'iconColor') {
        this.userPreference.iconColor = this.getIconColor();
      }
    });
  }

  init = async () => {
    try {
      this.userPreference.iconColor = this.getIconColor();
    } catch (_error) {
      console.log('Load Config Error');
    }
  };

  updateIconColor = async (color: TIconColor) => {
    await this.syncStorageService.set('iconColor', color);
  };

  private getIconColor = () => {
    return (this.syncStorageService.get('iconColor') as 'dark' | 'light' | 'auto' | null) ?? 'auto';
  };
}

Service(IPreferenceService)(PreferenceService);
