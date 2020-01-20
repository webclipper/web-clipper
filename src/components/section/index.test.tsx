import Section from './index';
import React from 'react';
import { render } from 'enzyme';
import 'enzyme-adapter-react-16';

describe('test Section', () => {
  it('should render correct', () => {
    expect(
      render(
        <Section title="test">
          <div>test</div>
        </Section>
      )
    ).toMatchSnapshot();
  });
});
