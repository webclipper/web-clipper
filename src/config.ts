interface WebClipperConfig {
  icon: string;
  yuqueClientId: string;
  yuqueCallback: string;
  yuqueScope: string;
  oneNoteCallBack: string;
  oneNoteClientId: string;
  createLogger: boolean;
}

let config: WebClipperConfig = {
  icon: 'icon.png',
  yuqueClientId: 'D1AwzCeDPLFWGfcGv7ze',
  yuqueCallback: 'http://webclipper-oauth.yfd.im/yuque_oauth',
  yuqueScope: 'doc,group,repo',
  oneNoteClientId: '563571ad-cfcd-442a-aa34-046bad24b1b6',
  oneNoteCallBack: 'https://webclipper-oauth.yfd.im/onenote_oauth',
  createLogger: false,
  // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
};

if (process.env.NODE_ENV === 'development') {
  config = Object.assign({}, config, {
    icon: 'icon-dev.png',
    yuqueClientId: 'fylbi7lzfNjhkfyi0hJp',
    yuqueCallback: 'http://webclipper-oauth.test.yfd.im/yuque_oauth',
    oneNoteClientId: '01c7500b-98dd-4f37-813f-a959382793ac',
    oneNoteCallBack: 'https://webclipper-oauth.test.yfd.im/onenote_oauth',
    // oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
    createLogger: false,
  });
}

export default config;
