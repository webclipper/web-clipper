type Omit<T, K extends keyof T> = Pick<
  T,
  ({ [P in keyof T]: P } &
  { [P in K]: never } & { [x: string]: never })[keyof T]
>;
