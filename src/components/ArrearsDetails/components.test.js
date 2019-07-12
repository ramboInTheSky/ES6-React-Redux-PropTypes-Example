import React from 'react';
import { shallow } from 'enzyme';

import 'jest-styled-components';

import { Heading, Label, LabelLink, Wrapper } from './components';

describe('ArrearsDetails components', () => {
  it('should render <Heading /> correctly', () => {
    expect(shallow(<Heading />)).toMatchSnapshot();
  });

  it('should render <Label /> correctly', () => {
    expect(shallow(<Label />)).toMatchSnapshot();
  });

  it('should render <LabelLink /> correctly', () => {
    expect(shallow(<LabelLink />)).toMatchSnapshot();
  });

  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
});
