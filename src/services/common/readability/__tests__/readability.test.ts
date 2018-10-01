
/**
 * @jest-environment jsdom
 */

import ReadabilityTs from '../readability';

describe('测试 Readability', function () {

  let readabilityTs: ReadabilityTs;

  beforeEach(() => {
    readabilityTs = new ReadabilityTs();
  });

  it('测试 getInnerText 函数', function () {

    let testNode1 = document.createElement('DIV');
    testNode1.innerHTML = '<div>  test1 </div>';
    expect(readabilityTs.getInnerText(testNode1)).toEqual('test1');

    let testNode2 = document.createElement('DIV');
    testNode2.innerHTML = '<div>  test 1 </div>';
    expect(readabilityTs.getInnerText(testNode2)).toEqual('test 1');

    let testNode3 = document.createElement('DIV');
    testNode3.innerHTML = '<div>  test      1 </div>';
    expect(readabilityTs.getInnerText(testNode3, true)).toEqual('test 1');

    let testNode4 = document.createElement('DIV');
    testNode4.innerHTML = '<div>  test      1  2  3   </div>';
    expect(readabilityTs.getInnerText(testNode4, true)).toEqual('test 1 2 3');

    let testNode5 = document.createElement('DIV');
    expect(readabilityTs.getInnerText(testNode5)).toEqual('');
  });

});

