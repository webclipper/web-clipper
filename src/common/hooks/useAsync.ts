import { useRef, useState, useCallback, DependencyList, useEffect } from 'react';

interface IUseAsyncOption<T> {
  manual?: boolean;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
}

interface IUseAsyncResult<T> {
  result: T;
  loading: boolean;
  error?: Error;
  readonly cancel: () => void;
  run: (...args: any[]) => Promise<T>;
}

export default function useAsync<T>(
  fn: (...args: any[]) => Promise<T>,
  deps: DependencyList = [],
  options: IUseAsyncOption<T> = {}
) {
  const execCount = useRef(0);
  const [state, setState] = useState<Partial<IUseAsyncResult<T>>>({
    loading: false,
  });

  const cancel = useCallback(() => {
    execCount.current += 1;
    setState(s => ({ ...s, error: new Error('canceled'), loading: false }));
  }, []);

  const run = useCallback(
    (...args: any[]): Promise<T> => {
      execCount.current += 1;
      const runCount = execCount.current;
      setState(s => ({ ...s, loading: true }));
      return fn(...args)
        .then(result => {
          if (runCount === execCount.current) {
            if (options.onSuccess) {
              options.onSuccess(result);
            }
          }
          if (runCount === execCount.current) {
            setState(s => ({ ...s, result, loading: false }));
          }
          return result;
        })
        .catch(error => {
          if (runCount === execCount.current) {
            if (options.onError) {
              options.onError(error);
            }
            setState(s => ({ ...s, error, loading: false }));
          }
          return error;
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  useEffect(
    (...args: any[]) => {
      if (!options.manual) {
        run(...(args || []));
      }
      return () => {
        execCount.current += 1;
      };
    },
    [options.manual, run]
  );

  return {
    loading: state.loading!,
    result: state.result,
    error: state.error,
    cancel,
    run,
  } as IUseAsyncResult<T>;
}
