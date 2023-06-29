interface WebClipperConfig {
  icon: string;
  iconDark: string;
  yuqueClientId: string;
  yuqueCallback: string;
  yuqueScope: string;
  oneNoteCallBack: string;
  oneNoteClientId: string;
  loadRemoteConfig: boolean;
  admin: boolean;
}

export interface RemoteConfig {
  iconfont: string;
  chromeWebStoreVersion: string;
}

let config: WebClipperConfig = {
  admin: false,
  icon: 'icon.png',
  iconDark: 'icon-dark.png',
  yuqueClientId: 'D1AwzCeDPLFWGfcGv7ze',
  yuqueCallback: 'http://webclipper-oauth.yfd.im/yuque_oauth',
  yuqueScope: 'doc,group,repo,attach_upload',
  oneNoteClientId: '563571ad-cfcd-442a-aa34-046bad24b1b6',
  oneNoteCallBack: 'https://webclipper-oauth.yfd.im/onenote_oauth',
  // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
  loadRemoteConfig: true,
};

if (process.env.NODE_ENV === 'development') {
  config = Object.assign({}, config, {
    admin: true,
    loadRemoteConfig: false,
    icon: 'icon-dev.png',
    yuqueClientId: 'fylbi7lzfNjhkfyi0hJp',
    yuqueCallback: 'http://webclipper-oauth.test.yfd.im/yuque_oauth',
    oneNoteClientId: '01c7500b-98dd-4f37-813f-a959382793ac',
    oneNoteCallBack: 'https://webclipper-oauth.test.yfd.im/onenote_oauth',
    // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
  });
}

export default config;
