import { ClipTextPlugin, ContentScriptContext } from './../interface';

export default {
  type: 'text',
  id: 'DiamondYuan/bookmark',
  version: '0.0.1',
  name: '书签',
  icon: 'link',
  description: '保存网页链接和增加备注',
  run: (context: ContentScriptContext) => {
    const { document } = context;
    return `## 链接 \n ${document.URL} \n ## 备注: \n`;
  },
} as ClipTextPlugin;
