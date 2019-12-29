/* eslint-disable no-loop-func */
import { loading, loadingStatus } from './loading';
import { autorun, action, observable } from 'mobx';

function flushPromises() {
  return new Promise(resolve => setImmediate(resolve));
}

jest.useFakeTimers();

class Test {
  @observable
  public actionAfterLoadingCount = 0;

  @observable
  public actionBeforeLoadingCount = 0;

  @loading
  exec = (time: number) => {
    return new Promise(r => setTimeout(r, time));
  };

  @action
  @loading
  actionAfterLoading() {
    this.actionAfterLoadingCount++;
    this.actionAfterLoadingCount++;
  }

  @loading
  @action
  actionBeforeLoading() {
    this.actionBeforeLoadingCount++;
    this.actionBeforeLoadingCount++;
  }
}

describe('test loading decorator', () => {
  it('test race condition', async () => {
    const instance = new Test();
    instance.exec(3000);
    instance.exec(9000);
    await jest.advanceTimersByTime(5000);
    expect(loadingStatus(instance).exec).toBe(true);
    await jest.advanceTimersByTime(5000);
    await flushPromises();
    expect(loadingStatus(instance).exec).toBe(false);
  });

  it('test auto run', async () => {
    const instance = new Test();
    const log = jest.fn();
    instance.exec(3000);
    autorun(() => {
      log(loadingStatus(instance).exec);
    });
    await jest.advanceTimersByTime(1000);
    expect(log).toBeCalledTimes(1);
    expect(log).toHaveBeenLastCalledWith(true);
    await jest.advanceTimersByTime(3000);
    await flushPromises();
    expect(log).toBeCalledTimes(2);
    expect(log).toHaveBeenLastCalledWith(false);
  });

  describe('should work correct with action', () => {
    it('actionBeforeLoading ', async () => {
      const instance = new Test();
      const result: string[] = [];
      const log = (daa: string) => {
        result.push(daa);
      };
      autorun(() => {
        const loading = loadingStatus(instance).actionBeforeLoading;
        const count = instance.actionBeforeLoadingCount;
        log(`${loading}-${count}`);
      });
      instance.actionBeforeLoading();
      expect(loadingStatus(instance).actionBeforeLoading).toBe(true);
      await jest.advanceTimersByTime(1000);
      expect(loadingStatus(instance).actionBeforeLoading).toBe(false);
      expect(result).toEqual(['undefined-0', 'true-0', 'true-2', 'false-2']);
    });

    it('actionAfterLoading', async () => {
      const instance = new Test();
      const result: string[] = [];
      const log = (daa: string) => {
        result.push(daa);
      };
      autorun(() => {
        const loading = loadingStatus(instance).actionAfterLoading;
        const count = instance.actionAfterLoadingCount;
        log(`${loading}-${count}`);
      });
      instance.actionAfterLoading();
      expect(loadingStatus(instance).actionAfterLoading).toBe(true);
      await jest.advanceTimersByTime(1000);
      expect(loadingStatus(instance).actionAfterLoading).toBe(false);
      expect(result).toEqual(['undefined-0', 'true-2', 'false-2']);
    });
  });
});
