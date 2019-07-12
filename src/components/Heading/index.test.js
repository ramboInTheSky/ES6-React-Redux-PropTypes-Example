import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import Heading from './';

describe('Heading', () => {
  it('should render correctly', () => {
    expect(shallow(<Heading />)).toMatchSnapshot();
  });
});
