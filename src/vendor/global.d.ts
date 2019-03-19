declare module '*.scss';
/// <reference path="../../node_modules/@types/chrome/index.d.ts"/>
interface ClipperPlugin extends BasePlugin {
  type: 'clipper';
  /** 脚本代码 */
  script: string;
}

interface ToolPlugin extends BasePlugin {
  type: 'tool';
  processingDocumentObjectModel?: string;
  processingDocuments?: string;
}

interface BasePlugin {
  type: string;
  /** id 不能重复 */
  id: string;
  /** 版本号 */
  version: string;
  /** 名字可重复*/
  name: string;
  /** 如果是 http 开头，则为图片。否则是 ant design 的icon*/
  icon: string;
  /** 介绍 */
  description?: string;
  /** 匹配的域名 */
  match?: string[];
  /** 根据环境判断是否显示在工具栏，如果为空则一直显示 */
  display?: string;
}

/**
 * 脚本执行的上下文
 */
interface ClipperPluginContext {
  $: JQueryStatic;
  turndown: any;
  Highlighter: any;
  toggleClipper: any;
  Readability: any;
  document: any;
}

interface MessageApi {
  info(content: string): void;
}
interface PagePluginContext {
  currentData: string;
  previous: string;
  imageService: ImageHostingService;
  message: MessageApi;
}
