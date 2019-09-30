import * as tld from 'tldjs';

const RE_MATCH_PARTS = /(.*?):\/\/([^/]*)\/(.*)/;

const RE_HTTP_OR_HTTPS = /^https?$/i;

function str2RE(str: string): string {
  return str.replace(/([.?+[\]{}()|^$])/g, '\\$1').replace(/\*/g, '.*?');
}

function matchScheme(rule: string, data: string) {
  if (rule === data) {
    return true;
  }
  if (['*', 'http*'].includes(rule) && RE_HTTP_OR_HTTPS.test(data)) {
    return 1;
  }
  return 0;
}

const RE_STR_ANY = '(?:|.*?\\.)';
const RE_STR_TLD = '((?:\\.\\w+)+)';
function hostMatcher(rule: string) {
  let prefix = '';
  let base = rule;
  let suffix = '';
  if (rule.startsWith('*.')) {
    base = base.slice(2);
    prefix = RE_STR_ANY;
  }
  if (rule.endsWith('.tld')) {
    base = base.slice(0, -4);
    suffix = RE_STR_TLD;
  }
  const re = new RegExp(`^${prefix}${str2RE(base)}${suffix}$`);
  return (data: string) => {
    if (rule === '*') {
      return true;
    }
    if (rule === data) {
      return true;
    }
    const matches = data.match(re);
    if (matches) {
      const [, tldStr] = matches;
      if (!tldStr) {
        return true;
      }
      const tldSuffix = tldStr.slice(1);
      return tld.getPublicSuffix(tldSuffix) === tldSuffix;
    }
    return 0;
  };
}

function pathMatcher(rule: string) {
  const iHash = rule.indexOf('#');
  let iQuery = rule.indexOf('?');
  let strRe = str2RE(rule);
  if (iQuery > iHash) iQuery = -1;
  if (iHash < 0) {
    if (iQuery < 0) strRe = `^${strRe}(?:[?#]|$)`;
    else strRe = `^${strRe}(?:#|$)`;
  }
  const reRule = new RegExp(strRe);
  return (data: string) => reRule.test(data);
}

function matchTester(rule: string) {
  let test;
  if (rule === '<all_urls>') {
    test = () => true;
  } else {
    const ruleParts = rule.match(RE_MATCH_PARTS);
    if (ruleParts) {
      const matchHost = hostMatcher(ruleParts[2]);
      const matchPath = pathMatcher(ruleParts[3]);
      test = (url: string) => {
        const parts = url.match(RE_MATCH_PARTS);
        return (
          !!ruleParts &&
          !!parts &&
          matchScheme(ruleParts[1], parts[1]) &&
          matchHost(parts[2]) &&
          matchPath(parts[3])
        );
      };
    } else {
      test = () => false;
    }
  }
  return { test };
}

export default (rule: string, url?: string) => {
  if (!url) {
    return false;
  }
  return matchTester(rule).test(url);
};
