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
  imageService: any;
  message: MessageApi;
}

interface Repository {
  id: string;
  name: string;
  private: boolean;
  description: string;
  createdAt: string;
  owner: string;
  /**
   * namespace = owner/name
   */
  namespace: string;
}

interface UserInfo {
  name: string;
  avatar: string;
  homePage: string;
  description?: string;
}

interface CreateDocumentRequest {
  title: string;
  content: string;
  private: boolean;
  repositoryId: string;
  tags?: string[];
}
interface CreateDocumentResponse {
  href: string;
  repositoryId: string;
  documentId: string;
}

interface CreateRepositoryRequest {
  name: string;
  private: boolean;
}

interface UploadImageRequest {
  data: string;
}
