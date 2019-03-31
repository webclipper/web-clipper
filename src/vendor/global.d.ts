declare module '*.scss';
declare module 'readability';
declare module 'turndown' {
  let TurndownService: any;
  export default TurndownService;
}

type Omit<T, K extends keyof T> = Pick<
  T,
  ({ [P in keyof T]: P } &
    { [P in K]: never } & { [x: string]: never })[keyof T]
>;

/// <reference path="../../node_modules/@types/chrome/index.d.ts"/>
