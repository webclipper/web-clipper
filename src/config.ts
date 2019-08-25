interface WebClipperConfig {
  icon: string;
  yuqueClientId: string;
  yuqueCallback: string;
  yuequeScope: string;
}

let config: WebClipperConfig = {
  icon: 'icon.png',
  yuqueClientId: 'D1AwzCeDPLFWGfcGv7ze',
  yuqueCallback: 'http://webclipper-oauth.yfd.im/yuque_oauth',
  yuequeScope: 'doc,group,repo',
};

if (process.env.NODE_ENV === 'development') {
  config = Object.assign({}, config, {
    icon: 'icon-dev.png',
    yuqueClientId: 'fylbi7lzfNjhkfyi0hJp',
    yuqueCallback: 'http://webclipper-oauth.test.yfd.im/yuque_oauth',
  });
}

export default config;
