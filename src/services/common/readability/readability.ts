
const ReadabilityRegexps = {
  unlikelyCandidates: /combx|comment|community|disqus|extra|foot|header|menu|remark|rss|shoutbox|sidebar|sponsor|ad-break|agegate|pagination|pager|popup|tweet|twitter/i,
  okMaybeItsACandidate: /and|article|body|column|main|shadow/i,
  positive: /article|body|content|entry|hentry|main|page|pagination|post|text|blog|story/i,
  negative: /combx|comment|com-|contact|foot|footer|footnote|masthead|media|meta|outbrain|promo|related|scroll|shoutbox|sidebar|sponsor|shopping|tags|tool|widget/i,
  extraneous: /print|archive|comment|discuss|e[\-]?mail|share|reply|all|login|sign|single/i,
  divToPElements: /<(a|blockquote|dl|div|img|ol|p|pre|table|ul)/i,
  replaceBrs: /(<br[^>]*>[ \n\r\t]*){2,}/gi,
  replaceFonts: /<(\/?)font[^>]*>/gi,
  trim: /^\s+|\s+$/g,
  normalize: /\s{2,}/g,
  killBreaks: /(<br\s*\/?>(\s|&nbsp;?)*){1,}/g,
  videos: /http:\/\/(www\.)?(youtube|vimeo)\.com/i,
  skipFootnoteLink: /^\s*(\[?[a-z0-9]{1,2}\]?|^|edit|citation needed)\s*$/i,
  nextLink: /(next|weiter|continue|>([^\|]|$)|»([^\|]|$))/i, // Match: next, continue, >, >>, » but not >|, »| as those usually mean last.
  prevLink: /(prev|earl|old|new|<|«)/i
};

class ReadabilityTs {

  constructor() {
    console.log('init');
  }

  /**
   * 获取元素的文本
   */
  getInnerText = (element: HTMLElement, normalizeSpaces?: boolean) => {
    if (element.textContent === null || typeof element.textContent === 'undefined') {
      return '';
    }
    let textContent = element.textContent.replace(ReadabilityRegexps.trim, '');

    if (normalizeSpaces) {
      return textContent.replace(ReadabilityRegexps.normalize, ' ');
    }
    return textContent;
  }

}

export default ReadabilityTs;
