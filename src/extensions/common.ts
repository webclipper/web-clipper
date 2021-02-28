import TurndownService from 'turndown';
import { IHighlighter } from '@web-clipper/highlight';
import { IAreaSelector } from '@web-clipper/area-selector';
import * as antd from 'antd';
import React from 'react';
import { IClearlyRequest } from '@/common/server';
import { IContentScriptService } from '@/service/common/contentScript';
import { IContextMenuExtension } from './contextMenus';

export interface InitContext {
  accountInfo: {
    type?: string;
  };
  url?: string;
  locale: string;
  pathname: string;
  currentImageHostingService?: {
    type: string;
  };
}

export interface ContentScriptContext {
  $: JQueryStatic;
  locale: string;
  turndown: TurndownService;
  Highlighter: Type<IHighlighter>;
  AreaSelector: Type<IAreaSelector>;
  toggleClipper: () => void;
  toggleLoading: () => void;
  Readability: any;
  document: Document;
  QRCode: any;
}

export interface Message {
  info(content: string): void;
}

export interface UploadImageRequest {
  data: string;
}

export interface ImageHostingService {
  getId(): string;

  uploadImage(request: UploadImageRequest): Promise<string>;

  uploadImageUrl(url: string): Promise<string>;
}

interface CopyToClipboardOptions {
  debug?: boolean;
  message?: string;
  format?: string; // MIME type
}

interface OCRRequest {
  image: string;
  language_type: 'CHN_ENG' | 'ENG' | 'JAP' | 'GER';
}
export interface ToolContext<T, Out> {
  locale: string;
  result: T;
  data: Out;
  message: Message;
  imageService?: ImageHostingService;
  loadImage: any;
  captureVisibleTab: any;
  copyToClipboard: (text: string, options?: CopyToClipboardOptions) => void;
  createAndDownloadFile: (fileName: string, content: string | Blob) => void;
  pangu: (content: string) => Promise<string>;
  ocr: (request: OCRRequest) => Promise<string>;
  clearly: (request: IClearlyRequest) => Promise<string>;
  antd: typeof antd;
  React: typeof React;
}

export interface IExtensionLifeCycle<T, U> {
  /**
   * 插件被加载之前
   */
  init?(context: InitContext): boolean;

  /**
   * 执行插件
   */
  run?(context: ContentScriptContext): Promise<T> | T;

  /**
   * 执行插件后
   */
  afterRun?(context: ToolContext<T, U>): Promise<U> | U;

  /**
   * 清理环境
   */
  destroy?(context: ContentScriptContext): void;
}

export interface IExtensionManifest {
  readonly name: string;

  readonly version: string;

  readonly description?: string;

  readonly icon?: string;

  readonly matches?: string[];

  readonly apiVersion?: string;

  readonly powerpack?: boolean;

  readonly keywords?: string[];

  readonly automatic?: boolean;

  readonly i18nManifest?: {
    [key: string]: {
      readonly name?: string;
      readonly description?: string;
      readonly icon?: string;
      readonly keywords?: string[];
    };
  };
}

export enum ExtensionType {
  Text = 'Text',
  Image = 'Image',
  Tool = 'tool',
}

export interface SerializedExtension {
  type: ExtensionType;
  manifest: IExtensionManifest;
  init?: string;
  run?: string;
  afterRun?: string;
  destroy?: string;
}

export interface SerializedExtensionWithId extends SerializedExtension {
  id: string;
  router: string;
  embedded: boolean;
}

export type SerializedExtensionInfo = Pick<SerializedExtensionWithId, 'type' | 'manifest' | 'id'>;

interface Type<T> extends Function {
  new (...args: any[]): T;
}

export interface IExtension<T, U> {
  readonly type: ExtensionType;
  readonly manifest: IExtensionManifest;
  readonly extensionLifeCycle: IExtensionLifeCycle<T, U>;
}
export interface IExtensionWithId<T = any, U = any> {
  readonly id: string;
  readonly router: string;
  readonly type: ExtensionType;
  readonly manifest: IExtensionManifest;
  readonly extensionLifeCycle: IExtensionLifeCycle<T, U>;
}

class AbstractExtension<T, U> {
  public readonly type: ExtensionType;
  public readonly manifest: IExtensionManifest;
  public readonly extensionLifeCycle: IExtensionLifeCycle<T, U>;

  constructor(
    type: ExtensionType,
    manifest: IExtensionManifest,
    extensionLifeCycle: IExtensionLifeCycle<T, U>
  ) {
    this.type = type;
    this.manifest = manifest;
    this.extensionLifeCycle = extensionLifeCycle;
  }
}

export class TextExtension<T = string> extends AbstractExtension<T, string> {
  constructor(manifest: IExtensionManifest, methods: IExtensionLifeCycle<T, string>) {
    super(ExtensionType.Text, manifest, methods);
  }
}

export class ToolExtension<T = string> extends AbstractExtension<T, string> {
  constructor(manifest: IExtensionManifest, methods: IExtensionLifeCycle<T, string>) {
    super(ExtensionType.Tool, manifest, methods);
  }
}

export interface IContextMenuContext {
  contentScriptService: IContentScriptService;
  initContentScriptService(id: number): Promise<void>;
}

export interface IContextMenuExtensionFactory {
  id: string;
  new (): IContextMenuExtension;
}

export interface IContextMenusWithId {
  id: string;
  contextMenu: IContextMenuExtensionFactory;
}
