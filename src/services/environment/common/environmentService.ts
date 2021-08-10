import { IBasicRequestService, IRequestService } from '@/service/common/request';
import { ILocaleService } from '@/service/common/locale';
import { Inject, Service } from 'typedi';
import { IEnvironmentService } from './environment';

const privacyLocale = ['en-US', 'zh-CN'];
const changelogLocale = ['en-US', 'zh-CN'];

export class EnvironmentService implements IEnvironmentService {
  constructor(
    @Inject(ILocaleService) private localeService: ILocaleService,
    @Inject(IBasicRequestService) private basicRequestService: IRequestService
  ) {}

  async privacy(): Promise<string> {
    let workLocale = 'en-US';
    if (privacyLocale.some(o => o === this.localeService.locale)) {
      workLocale = this.localeService.locale;
    }
    const privacyUrl = `${await this.resourceHost()}/privacy/PRIVACY.${workLocale}.md`;
    return this.basicRequestService.request(privacyUrl, { method: 'get' });
  }

  async changelog(): Promise<string> {
    let workLocale = 'en-US';
    if (changelogLocale.some(o => o === this.localeService.locale)) {
      workLocale = this.localeService.locale;
    }
    const changelogUrl = `${await this.resourceHost()}/changelog/CHANGELOG.${workLocale}.md`;
    return this.basicRequestService.request(changelogUrl, { method: 'get' });
  }

  async resourceHost(): Promise<string> {
    return 'https://resource.clipper.website';
  }
}

Service(IEnvironmentService)(EnvironmentService);
