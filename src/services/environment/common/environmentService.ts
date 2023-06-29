import { ILocaleService } from '@/service/common/locale';
import { Inject, Service } from 'typedi';
import { IEnvironmentService } from './environment';

//@ts-ignore
import ChangelogEnUS from './changelog/CHANGELOG.en-US.md';
//@ts-ignore
import ChangelogZhCN from './changelog/CHANGELOG.zh-CN.md';
//@ts-ignore
import PrivacyEnUS from './privacy/PRIVACY.en-US.md';
//@ts-ignore
import PrivacyZhCN from './privacy/PRIVACY.zh-CN.md';

const privacyLocale = {
  'en-US': PrivacyEnUS,
  'zh-CN': PrivacyZhCN,
} as const;

const changelogLocale = {
  'en-US': ChangelogEnUS,
  'zh-CN': ChangelogZhCN,
} as const;

type Locale = 'en-US' | 'zh-CN';

function keys<T>(data: T): (keyof T)[] {
  return (Object.keys(data as any) as any) as (keyof T)[];
}

export class EnvironmentService implements IEnvironmentService {
  constructor(@Inject(ILocaleService) private localeService: ILocaleService) {}

  async privacy(): Promise<string> {
    let workLocale: Locale = 'en-US';
    if (keys(privacyLocale).some(o => o === this.localeService.locale)) {
      workLocale = this.localeService.locale as Locale;
    }
    return privacyLocale[workLocale];
  }

  async changelog(): Promise<string> {
    let workLocale: Locale = 'en-US';
    if (Object.keys(changelogLocale).some(o => o === this.localeService.locale)) {
      workLocale = this.localeService.locale as Locale;
    }
    return changelogLocale[workLocale];
  }
}

Service(IEnvironmentService)(EnvironmentService);
