import { IWebRequestService } from '@/service/common/webRequest';
import { WebRequestChannel } from '@/service/webRequest/common/webRequestIPC';
import { IContentScriptService } from '@/service/common/contentScript';
import { ContentScriptChannelClient } from '@/service/contentScript/common/contentScriptIPC';
import { PopupContentScriptIPCClient } from '@/service/ipc/browser/popup/ipcClient';
import { ITrackService } from '@/service/common/track';
import * as browser from '@web-clipper/chrome-promise';
import config from '@/config';
import packageJson from '@/../package.json';
import Container from 'typedi';
import { IPermissionsService } from '@/service/common/permissions';
import { PermissionsChannel } from '@/service/permissions/common/permissionsIpc';
import { ITabService } from '@/service/common/tab';
import { IChannelServer } from '@/service/common/ipc';
import { BackgroundIPCServer } from '@/service/ipc/browser/background-main/ipcService';
import { TabChannel } from '@/service/tab/common/tabIpc';

const backgroundIPCServer: IChannelServer = new BackgroundIPCServer();

backgroundIPCServer.registerChannel('tab', new TabChannel(Container.get(ITabService)));

backgroundIPCServer.registerChannel(
  'permissions',
  new PermissionsChannel(Container.get(IPermissionsService))
);

backgroundIPCServer.registerChannel(
  'webRequest',
  new WebRequestChannel(Container.get(IWebRequestService))
);

const contentScriptIPCClient = new PopupContentScriptIPCClient(Container.get(ITabService));
const contentScriptChannel = contentScriptIPCClient.getChannel('contentScript');
Container.set(IContentScriptService, new ContentScriptChannelClient(contentScriptChannel));

const contentScriptService = Container.get(IContentScriptService);

const media = window.matchMedia('(prefers-color-scheme: dark)');
browser.browserAction.setIcon({ path: media.matches ? config.iconDark : config.icon });

const trackService = Container.get(ITrackService);
trackService.init();

browser.browserAction.onClicked.addListener(async tab => {
  const tabId = tab.id;
  if (!tabId) {
    trackService.trackEvent('Load_Web_Clipper', packageJson.version, 'error');
    alert(
      'Clipping of this type of page is temporarily unavailable.\n\nRefreshing the page can resolve。\n\n暂时无法剪辑此类型的页面。\n\n刷新页面可以解决。'
    );
    return;
  }
  trackService.trackEvent('Load_Web_Clipper', packageJson.version, 'success');
  let result;
  try {
    result = await contentScriptService.checkStatus();
  } catch (_error) {}
  if (!result) {
    await browser.tabs.executeScript(
      {
        file: 'content_script.js',
      },
      tabId
    );
    if (browser.runtime.lastError) {
      if (browser.runtime.lastError.message === 'The extensions gallery cannot be scripted.') {
        alert('The extensions gallery cannot be scripted.\n\n插件商店不允许执行脚本');
        return;
      }
      alert(
        'Clipping of this type of page is temporarily unavailable.\n\nRefreshing the page can resolve。\n\n暂时无法剪辑此类型的页面。\n\n刷新页面可以解决。'
      );
      return;
    }
  }
  contentScriptService.toggle();
});
