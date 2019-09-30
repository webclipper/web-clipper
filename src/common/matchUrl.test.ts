/* eslint-disable no-loop-func */
import matchUrl from './matchUrl';

describe('test matchUrl', () => {
  describe('should match all', () => {
    const cases: { rule: string; true?: string[]; false?: string[] }[] = [
      {
        rule: '*://*/*',
        true: ['http://www.google.com/', 'https://www.google.com/'],
      },
      {
        rule: '*://docs.google.com/',
        true: ['https://docs.google.com/'],
        false: ['https://docs.google.com.cn/', 'https://sub.docs.google.com/'],
      },
      {
        rule: '*://*.google.com/',
        true: ['https://www.google.com/', 'https://a.b.google.com/', 'https://google.com/'],
        false: ['https://www.google.com.hk/'],
      },
      {
        rule: '*://www.google.tld/',
        true: ['https://www.google.com/', 'https://www.google.com.cn/', 'https://www.google.jp/'],
        false: ['https://www.google.example.com/'],
      },
      {
        rule: 'https://www.google.com/a',
        true: [
          'https://www.google.com/a',
          'https://www.google.com/a#hash',
          'https://www.google.com/a?query',
          'https://www.google.com/a?query#hash',
        ],
      },
    ];
    for (const iterator of cases) {
      it(`test rune ${iterator.rule}`, () => {
        if (Array.isArray(iterator.true)) {
          for (const url of iterator.true) {
            expect(matchUrl(iterator.rule, url)).toBeTruthy();
          }
        }
        if (Array.isArray(iterator.false)) {
          for (const url of iterator.false) {
            expect(matchUrl(iterator.rule, url)).toBeFalsy();
          }
        }
      });
    }
  });
});
