import * as React from 'react';
import Loading from '../index';
import { shallow, configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('测试 Loading 组件', function () {

  it('测试 Loading 文本', function () {
    const wrapper = shallow(<Loading></Loading>);
    expect(wrapper.find('p').text()).toBe('loading');
  });

});

