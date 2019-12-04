interface WebClipperConfig {
  icon: string;
  yuqueClientId: string;
  yuqueCallback: string;
  githubClientId: string;
  githubCallback: string;
  yuqueScope: string;
  oneNoteCallBack: string;
  oneNoteClientId: string;
  createLogger: boolean;
  remoteExtensionHost: string;
  serverHost: string;
  resourceHost: string;
}

export interface RemoteConfig {
  iconfont: string;
  chromeWebStoreVersion: string;
}

let config: WebClipperConfig = {
  icon: 'icon.png',
  yuqueClientId: 'D1AwzCeDPLFWGfcGv7ze',
  yuqueCallback: 'http://webclipper-oauth.yfd.im/yuque_oauth',
  githubClientId: '94f779401c7bed8734ce',
  githubCallback: 'https://api.clipper.website/api/user/oauth/github',
  yuqueScope: 'doc,group,repo',
  oneNoteClientId: '563571ad-cfcd-442a-aa34-046bad24b1b6',
  oneNoteCallBack: 'https://webclipper-oauth.yfd.im/onenote_oauth',
  createLogger: false,
  // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
  remoteExtensionHost: 'https://extensions.clipper.website',
  serverHost: 'https://api.clipper.website',
  resourceHost: 'https://resource.clipper.website',
};

if (process.env.NODE_ENV === 'development') {
  config = Object.assign({}, config, {
    icon: 'icon-dev.png',
    yuqueClientId: 'fylbi7lzfNjhkfyi0hJp',
    yuqueCallback: 'http://webclipper-oauth.test.yfd.im/yuque_oauth',
    githubClientId: 'acad97d010cd6d7ef560',
    githubCallback: 'http://localhost:3000/api/user/oauth/github',
    oneNoteClientId: '01c7500b-98dd-4f37-813f-a959382793ac',
    oneNoteCallBack: 'https://webclipper-oauth.test.yfd.im/onenote_oauth',
    // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
    createLogger: false,
    // remoteExtensionHost: 'https://extensions.dev.clipper.website',
    // remoteExtensionHost: 'https://extensions.clipper.website',
    // remoteExtensionHost: 'http://localhost:3000',
    // serverHost: 'http://localhost:3000',
  });
}

export default config;
