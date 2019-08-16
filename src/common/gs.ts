export function initGa() {
  window._gaq = window._gaq || [];
  window._gaq.push(['_setAccount', `UA-145404263-2`]);
  let ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  let s = document.getElementsByTagName('script')[0];
  if (s && s.parentNode) {
    s.parentNode.insertBefore(ga, s);
  }
}

export function trackEvent(...args: string[]) {
  console.log(['_trackEvent', ...args]);
  window._gaq.push(['_trackEvent', ...args]);
}
