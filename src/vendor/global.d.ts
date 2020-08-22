declare module '*.less';
declare module '*.png';
declare module '@web-clipper/readability';
declare module 'turndown-plugin-gfm';
declare module 'dva-logger';
declare module '@web-clipper/remark-pangu';
declare module 'dva-loading';
declare module '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
declare module '@ckeditor/ckeditor5-essentials/src/essentials';
declare module '@ckeditor/ckeditor5-paragraph/src/paragraph';
declare module '@ckeditor/ckeditor5-basic-styles/src/bold';
declare module '@ckeditor/ckeditor5-basic-styles/src/italic';

type PromiseType<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

type Unpack<T> = T extends Promise<infer U> ? U : T;
// eslint-disable-next-line no-unused-vars
type CallResult<T extends (...args: any[]) => any> = Unpack<ReturnType<T>>;

interface Type<T> extends Function {
  new (...args: any[]): T;
}

/// <reference path="../../node_modules/@types/chrome/index.d.ts"/>

interface Window {
  _gaq: string[][];
}
