import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { NoteItem, NoteSubject, NoteBody, Wrapper, H3, NoteDate, NoteAuthor } from './components';

describe('DocumentsList components', () => {
  it('should render <H3 /> correctly', () => {
    expect(shallow(<H3 />)).toMatchSnapshot();
  });
  it('should render <NoteItem /> correctly', () => {
    expect(shallow(<NoteItem />)).toMatchSnapshot();
  });
  it('should render <NoteBody /> correctly', () => {
    expect(shallow(<NoteBody />)).toMatchSnapshot();
  });
  it('should render <NoteSubject /> correctly', () => {
    expect(shallow(<NoteSubject />)).toMatchSnapshot();
  });
  it('should render <Wrapper /> correctly', () => {
    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
  it('should render <NoteDate /> correctly', () => {
    expect(shallow(<NoteDate />)).toMatchSnapshot();
  });

  it('should render <NoteAuthor /> correctly', () => {
    expect(shallow(<NoteAuthor />)).toMatchSnapshot();
  });
});
