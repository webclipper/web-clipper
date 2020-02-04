import { ITrackService, TrackEventCategory } from './common/track';

import { Service } from 'typedi';

class TrackService implements ITrackService {
  public enable = false;

  init() {
    // window._gaq = window._gaq || [];
    // window._gaq.push(['_setAccount', `UA-145404263-3`]);
    // let ga = document.createElement('script');
    // ga.type = 'text/javascript';
    // ga.async = true;
    // ga.src = 'https://ssl.google-analytics.com/ga.js';
    // let s = document.getElementsByTagName('script')[0];
    // if (s?.parentNode) {
    //   s.parentNode.insertBefore(ga, s);
    // }
  }

  toggle() {
    this.enable = !this.enable;
  }

  trackEvent = (category: TrackEventCategory, action: string, label?: string) => {
    if (!this.enable) {
      return;
    }
    window._gaq.push(['_trackEvent', category, action, label].filter((o): o is string => !!o));
  };
}

Service(ITrackService)(TrackService);
