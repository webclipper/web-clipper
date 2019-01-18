import { actionTypeHelper } from '../actionTypeHelper';

describe('test actionTypeHelper', () => {
  it('prefix show add to value', () => {
    const TEST_ACTION = {
      UPDATE: '',
      CREATE: ''
    };
    const data = actionTypeHelper('TEST_ACTION', TEST_ACTION);
    expect(data.UPDATE).toEqual('TEST_ACTION/UPDATE');
    expect(data.CREATE).toEqual('TEST_ACTION/CREATE');
  });
});
