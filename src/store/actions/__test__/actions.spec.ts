/* eslint-disable max-nested-callbacks */
/* eslint-disable no-loop-func */
import { Action } from 'redux';
import * as clipperActions from '../clipper';
import * as userInfo from '../userInfo';
import * as userPreference from '../userPreference';

describe('test action list', () => {
  const prefixList = ['CLIPPER', 'USER_INFO', 'USER_PREFERENCE'];
  const testActionList = [clipperActions, userInfo, userPreference];

  for (let i = 0; i < testActionList.length; i++) {
    const testAction = testActionList[i];
    const prefix = prefixList[i];
    describe(`test action ${prefix}`, () => {
      it(`all action type should start with ${prefix}`, () => {
        const actionKeys = Object.keys(testAction);
        actionKeys.forEach(key => {
          const action: Action = (testAction as any)[key];
          const type: string = action.type;
          expect(type.startsWith(prefix)).toBeTruthy();
        });
      });

      it('all action type should equal with action name', () => {
        const actionKeys = Object.keys(testAction);
        actionKeys.forEach(key => {
          const action: Action = (testAction as any)[key];
          const type: string = action.type;
          const expectName = type
            .split('/')[1]
            .split('_')
            .join('')
            .toUpperCase();
          expect(expectName).toBe(key.toUpperCase());
        });
      });

      it('name of async action should start with async', () => {
        const actionKeys = Object.keys(testAction);
        actionKeys.forEach(key => {
          const action: any = (testAction as any)[key];
          if (action.started) {
            expect(key.startsWith('async')).toBeTruthy();
          } else {
            expect(key.startsWith('async')).toBeFalsy();
          }
        });
      });
    });
  }
});
