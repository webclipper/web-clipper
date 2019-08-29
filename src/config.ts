interface WebClipperConfig {
  icon: string;
  yuqueClientId: string;
  yuqueCallback: string;
  yuqueScope: string;
  oneNoteCallBack: string;
  oneNoteClientId: string;
}

let config: WebClipperConfig = {
  icon: 'icon.png',
  yuqueClientId: 'D1AwzCeDPLFWGfcGv7ze',
  yuqueCallback: 'https://webclipper-oauth.yfd.im/yuque_oauth',
  yuqueScope: 'doc,group,repo',
  oneNoteClientId: '',
  oneNoteCallBack: '',
};

if (process.env.NODE_ENV === 'development') {
  config = Object.assign({}, config, {
    icon: 'icon-dev.png',
    yuqueClientId: 'fylbi7lzfNjhkfyi0hJp',
    yuqueCallback: 'https://webclipper-oauth.test.yfd.im/yuque_oauth',
    oneNoteClientId: '01c7500b-98dd-4f37-813f-a959382793ac',
    oneNoteCallBack: 'http://localhost:3000/onenote_oauth',
  });
}

export default config;
