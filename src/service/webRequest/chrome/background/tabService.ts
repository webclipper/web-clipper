import { IWebRequestService } from '@/service/common/webRequest';
import { Service } from 'typedi';
import { BackgroundWebRequestService } from '@/service/webRequest/browser/background/tabService';

class ChromeBackgroundWebRequestService extends BackgroundWebRequestService {
  constructor() {
    super();
  }
}

Service(IWebRequestService)(ChromeBackgroundWebRequestService);
