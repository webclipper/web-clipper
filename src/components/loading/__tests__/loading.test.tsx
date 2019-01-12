import * as React from 'react';
import Loading from '../index';
import { shallow, configure } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('测试 Loading 组件', function() {
  it('测试 Loading 文本', function() {
    const wrapper = shallow(<Loading />);
    expect(wrapper.find('div').hasClass('loadingContainer')).toBe(true);
    expect(wrapper.find('span').text()).toBe('正在加载语雀剪藏');
  });
});
