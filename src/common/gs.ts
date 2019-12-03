export function initGa() {
  window._gaq = window._gaq || [];
  window._gaq.push(['_setAccount', `UA-145404263-3`]);
  let ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  let s = document.getElementsByTagName('script')[0];
  if (s && s.parentNode) {
    s.parentNode.insertBefore(ga, s);
  }
}

export type TrackEventCategory =
  | 'Load_Web_Clipper' /** 加载插件，每次初始化时候记录。 */
  | 'Open_Page'; /** 打开页面 */

export function trackEvent(category: TrackEventCategory, action: string, label?: string) {
  window._gaq.push(['_trackEvent', category, action, label].filter((o): o is string => !!o));
}
