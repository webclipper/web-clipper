import { codeCallWithContext } from '../utils/plugin';

const getFullPage = (context: ClipperPluginContext) => {
  const { turndown, $ } = context;
  const $body = $('html').clone();
  $body.find('script').remove();
  $body.find('style').remove();
  $body.removeClass();
  return turndown.turndown($body.html());
};

const getReadability = (context: ClipperPluginContext) => {
  const { turndown, document, Readability } = context;
  let documentClone = document.cloneNode(true);
  let article = new Readability(documentClone).parse();
  return turndown.turndown(article.content);
};

const selectElement = async (context: ClipperPluginContext) => {
  const { turndown, Highlighter, toggleClipper } = context;
  const $body = $('html').clone();
  $body.find('script').remove();
  $body.find('style').remove();
  $body.removeClass();
  toggleClipper();
  const data = await new Highlighter().start();
  toggleClipper();
  return turndown.turndown(data);
};

const bookmark = async (context: ClipperPluginContext) => {
  const { document } = context;
  return `## 链接 \n ${document.URL} \n ## 备注: \n`;
};

export const getFullPagePlugin: ClipperPlugin = {
  type: 'clipper',
  id: 'fullPage',
  version: 1,
  name: '整个页面',
  icon: 'copy',
  description: '保存整个页面',
  script: codeCallWithContext(getFullPage),
  path: ['*']
};

export const getSelectItemPlugin: ClipperPlugin = {
  type: 'clipper',
  id: 'selectItem',
  version: 1,
  name: '手动选取',
  icon: 'select',
  script: codeCallWithContext(selectElement),
  path: ['*']
};

export const getReadabilityPlugin: ClipperPlugin = {
  type: 'clipper',
  id: 'readability',
  version: 1,
  name: '智能提取',
  icon: 'copy',
  script: codeCallWithContext(getReadability),
  description: '智能分析出页面的主要部分',
  path: ['*']
};

export const bookmarkPlugin: ClipperPlugin = {
  type: 'clipper',
  id: 'bookmark',
  version: 1,
  name: '书签',
  icon: 'link',
  description: '保存网页链接和增加备注',
  script: codeCallWithContext(bookmark),
  path: ['*']
};
