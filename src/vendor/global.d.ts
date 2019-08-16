declare module '*.scss';
declare module '*.png';
declare module '@diamondyuan/readability';
declare module 'turndown-plugin-gfm';
declare module 'dva-logger';
declare module 'dva-loading';

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
