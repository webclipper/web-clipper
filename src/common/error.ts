export interface SerializedError {
  readonly $isError: true;
  readonly name: string;
  readonly message: string;
  readonly stack: string;
}

export function transformErrorForSerialization(error: Error): SerializedError;
export function transformErrorForSerialization(error: any): any;
export function transformErrorForSerialization(error: any): any {
  if (error instanceof Error) {
    let { name, message } = error;
    const stack: string = (<any>error).stacktrace || (<any>error).stack;
    return {
      $isError: true,
      name,
      message,
      stack,
    };
  }

  // return as is
  return error;
}
