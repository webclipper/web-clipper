/**
 * @jest-environment jsdom
 */
import * as React from 'react';
import Preview from '../index';
import { shallow, configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import { ClipperPreiviewDataTypeEnum } from '../../../enums';
import ClipperUrlPreiview from '../ClipperUrlPreiview';
import { ClipperPreiviewData, ClipperUrlPreiviewData } from '../../../store/ClipperPreview';

configure({ adapter: new Adapter() });

describe('测试 Loading 组件', function () {

  it('测试 Loading 文本', function () {

    const map: { [key: string]: ClipperPreiviewData } = {};
    map[ClipperPreiviewDataTypeEnum.URL] = new ClipperUrlPreiviewData('www.qq');

    const prop = {
      type: ClipperPreiviewDataTypeEnum.URL,
      map: map
    };

    const result = shallow(<Preview map={prop.map} type={prop.type}></Preview>);
    expect(result.find(ClipperUrlPreiview).text()).toEqual('<ClipperUrlPreiview />');

  });

});

