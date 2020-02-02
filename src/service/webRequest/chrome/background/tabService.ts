import { IWebRequestService } from '@/service/common/webRequest';
import { Service } from 'typedi';
import { BackgroundWebRequestService } from '@/service/webRequest/browser/background/tabService';

export const WEB_REQUEST_BLOCK_HEADER = 'web_clipper_web_request';

class ChromeBackgroundWebRequestService extends BackgroundWebRequestService {
  constructor() {
    super(['blocking', 'requestHeaders', 'extraHeaders']);
  }
}

Service(IWebRequestService)(ChromeBackgroundWebRequestService);
