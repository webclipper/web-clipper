import { ImageHostingService } from './../src/common/backend/index';

export interface BeforeLoadContext {
  accountInfo: {
    type: string;
  };
  url: string;
}

export interface ContentScriptContext {
  $: JQueryStatic;
  turndown: any;
  Highlighter: any;
  toggleClipper: any;
  Readability: any;
  document: Document;
}

export interface Message {
  info(content: string): void;
}

export interface ToolContext<T, Out> {
  result: T;
  data: Out;
  message: Message;
  imageService: ImageHostingService;
}

export interface BasePlugin<T = string, Out = string> {
  type: 'text' | 'tool' | 'image';
  id: string;
  version: string;
  name: string;
  icon: string;
  description: string;
  /**
   * 插件被加载之前
   */
  beforeLoad?: (context: BeforeLoadContext) => true;

  /**
   * 执行插件
   */
  run?: (context: ContentScriptContext) => Promise<T>;

  /**
   * 执行插件后
   */
  afterRun?: (context: ToolContext<T, Out>) => Out;

  /**
   * 清理环境
   */
  clean?: (context: ContentScriptContext) => void;
}
