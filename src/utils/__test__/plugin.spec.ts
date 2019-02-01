/* eslint-disable no-eval */
import { codeCallWithContext } from '../plugin';

describe('test plugin.ts', () => {
  const error = new Error('DiamondYuan Error');
  const func1 = (context: any) => {
    return context;
  };
  const func2 = async (context: any) => {
    return context;
  };
  const errorFunc1 = async () => {
    throw error;
  };

  it('should throw TypeError error argument is not function', () => {
    try {
      //@ts-ignore
      codeCallWithContext({});
    } catch (error) {
      expect(error).toEqual(new TypeError('plugin must be function.'));
    }
  });

  it('context should be context when undefined', () => {
    expect(eval(codeCallWithContext(func1))).toEqual({});
  });

  it('could read context when context is not undefined', () => {
    let context = { name: 'DiamondYuan' };
    expect(eval(codeCallWithContext(func1))).toBe(context);
  });

  it('should work with async function', async () => {
    let context = { name: 'DiamondYuan' };
    const data = await eval(codeCallWithContext(func2));
    expect(data).toBe(context);
  });

  it('should throw error', async () => {
    try {
      await eval(codeCallWithContext(errorFunc1));
    } catch (error) {
      expect(error).toEqual(error);
    }
  });
});
