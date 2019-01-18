import * as actionTypes from '../actionTypes';

describe('test actionTypes', () => {
  it('all name of actionType should be upperCase', () => {
    Object.keys(actionTypes).forEach(key => {
      expect(key.toUpperCase()).toBe(key);
    });
  });

  it('all key of actionType should be upperCase (全部 actionType 对象的全部 key 都需要大写)', () => {
    for (let key of Object.keys(actionTypes)) {
      const actionType = (actionTypes as any)[key];
      // eslint-disable-next-line no-loop-func
      Object.keys(actionType).forEach(valueKey => {
        expect(valueKey.toUpperCase()).toBe(valueKey);
      });
    }
  });

  //全部 value 的前缀要和 actionType 的名字相同
  it('all prefix of should be equal to actionType name', () => {
    for (let key of Object.keys(actionTypes)) {
      const actionType: any = (actionTypes as any)[key];
      // eslint-disable-next-line no-loop-func
      Object.keys(actionType).forEach(valueKey => {
        const value: string = actionType[valueKey];
        expect(value.startsWith(`${key}/`)).toBeTruthy();
      });
    }
  });
});
