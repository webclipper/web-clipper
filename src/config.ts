interface WebClipperConfig {
  icon: string;
  iconDark: string;
  yuqueClientId: string;
  yuqueCallback: string;
  githubClientId: string;
  githubCallback: string;
  yuqueScope: string;
  oneNoteCallBack: string;
  oneNoteClientId: string;
  createLogger: boolean;
  serverHost: string;
  resourceHost: string;
  loadRemoteConfig: boolean;
  googleOauth: {
    clientId: string;
    callback: string;
  };
}

export interface RemoteConfig {
  iconfont: string;
  chromeWebStoreVersion: string;
}

let config: WebClipperConfig = {
  googleOauth: {
    clientId: '269705697424-vlu486hs2paqj71p9defgvkbrpo9amcq.apps.googleusercontent.com',
    callback: 'https://api.clipper.website/api/user/oauth/google',
  },
  icon: 'icon.png',
  iconDark: 'icon-dark.png',
  yuqueClientId: 'D1AwzCeDPLFWGfcGv7ze',
  yuqueCallback: 'http://webclipper-oauth.yfd.im/yuque_oauth',
  githubClientId: '94f779401c7bed8734ce',
  githubCallback: 'https://api.clipper.website/api/user/oauth/github',
  yuqueScope: 'doc,group,repo,attach_upload',
  oneNoteClientId: '563571ad-cfcd-442a-aa34-046bad24b1b6',
  oneNoteCallBack: 'https://webclipper-oauth.yfd.im/onenote_oauth',
  createLogger: false,
  // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
  serverHost: 'https://api.clipper.website',
  resourceHost: 'https://resource.clipper.website',
  loadRemoteConfig: true,
};

if (process.env.NODE_ENV === 'development') {
  config = Object.assign({}, config, {
    googleOauth: {
      clientId: '269705697424-l6h6e3pkcsjs3lggjdlivs7vaarr8gp0.apps.googleusercontent.com',
      callback: 'https://api.test.clipper.website/api/user/oauth/google',
      // callback: 'http://localhost:3000/api/user/oauth/google', // Local test
    },
    loadRemoteConfig: false,
    icon: 'icon-dev.png',
    yuqueClientId: 'fylbi7lzfNjhkfyi0hJp',
    yuqueCallback: 'http://webclipper-oauth.test.yfd.im/yuque_oauth',
    // githubClientId: 'acad97d010cd6d7ef560',
    // githubCallback: 'http://localhost:3000/api/user/oauth/github',
    oneNoteClientId: '01c7500b-98dd-4f37-813f-a959382793ac',
    oneNoteCallBack: 'https://webclipper-oauth.test.yfd.im/onenote_oauth',
    // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
    createLogger: false,
    serverHost: 'https://api.test.clipper.website',
    // serverHost: 'http://localhost:3000',
  });
}

export default config;
