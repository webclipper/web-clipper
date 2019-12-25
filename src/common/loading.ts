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
          console.log(key, loadingMap.get(uuid));
          return loadingMap.get(uuid);
        },
      });
    });
    cache.set(instance, result);
  }
  return cache.get(instance);
}

function LoadingHoc(this: any, uuidKey: string, fn: Function) {
  return function() {
    loadingMap.set(uuidKey, true);
    //@ts-ignore
    let promise = fn.apply(this, arguments);
    if (typeof promise === 'object' && typeof promise.finally === 'function') {
      promise.finally(() => {
        loadingMap.set(uuidKey, false);
      });
    } else {
      loadingMap.set(uuidKey, false);
    }
    return promise;
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
