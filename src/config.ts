interface WebClipperConfig {
  icon: string;
  iconDark: string;
  yuqueClientId: string;
  yuqueCallback: string;
  yuqueScope: string;
  oneNoteCallBack: string;
  oneNoteClientId: string;
}

export interface RemoteConfig {
  iconfont: string;
  chromeWebStoreVersion: string;
}

let config: WebClipperConfig = {
  icon: 'icon.png',
  iconDark: 'icon-dark.png',
  yuqueClientId: 'D1AwzCeDPLFWGfcGv7ze',
  yuqueCallback: 'http://webclipper-oauth.yfd.im/yuque_oauth',
  yuqueScope: 'doc,group,repo,attach_upload',
  oneNoteClientId: '563571ad-cfcd-442a-aa34-046bad24b1b6',
  oneNoteCallBack: 'https://webclipper-oauth.yfd.im/onenote_oauth',
};

if (process.env.NODE_ENV === 'development') {
  config = Object.assign({}, config, {
    icon: 'icon-dev.png',
  });
}

export default config;
