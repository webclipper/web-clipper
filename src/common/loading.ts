import { observable } from 'mobx';
import { generateUuid } from '@web-clipper/shared/lib/uuid';

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

const loadingMap = observable.map<string, boolean>();

const cache = new Map<any, any>();

export function loadingStatus<T>(
  instance: T
): {
  [P in FunctionKeys<T>]: boolean;
} {
  if (!cache.has(instance)) {
    const result = {};
    Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).forEach(key => {
      Object.defineProperty(result, key, {
        get: () => {
          const uuid = Reflect.getMetadata(`loading:${key}`, instance);
          if (!uuid) {
            throw new Error();
          }
          return loadingMap.get(uuid);
        },
      });
    });
    cache.set(instance, result);
  }
  return cache.get(instance);
}

function LoadingHoc(uuidKey: string, fn: Function) {
  let execCount = 0;
  return async function() {
    const execCountCache = execCount + 1;
    execCount = execCountCache;
    try {
      loadingMap.set(uuidKey, true);
      //@ts-ignore
      return await fn.apply(this, arguments);
    } catch (err) {
      throw err;
    } finally {
      if (execCountCache === execCount) {
        loadingMap.set(uuidKey, false);
      }
    }
  };
}

export function loading(target: any, key: string, descriptor?: any) {
  const uuidKey = generateUuid();
  Reflect.defineMetadata(`loading:${key}`, uuidKey, target);

  if (descriptor) {
    descriptor.value = LoadingHoc(uuidKey, descriptor.value);
  } else {
    Object.defineProperty(target, key, {
      enumerable: false,
      configurable: true,
      set(v: any) {
        Object.defineProperty(this, key, {
          enumerable: false,
          writable: true,
          configurable: true,
          value: LoadingHoc(uuidKey, v),
        });
      },
      get() {
        // eslint-disable-next-line no-undefined
        return undefined;
      },
    });
  }
}
