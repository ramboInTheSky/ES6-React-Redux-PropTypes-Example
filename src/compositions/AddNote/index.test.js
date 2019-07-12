import React from 'react';
import { shallow } from 'enzyme';

import { AddNoteComposition } from './';

describe('<AddNoteComposition />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      addInteraction: 'addInteraction',
      addNote: 'addNote',
      arrearsId: 'foo',
      attachFile: 'attachFile',
      back: 'back',
      clearError: jest.fn(),
      formError: 'formError',
      note: 'note',
      noteError: 'noteError',
      onBack: jest.fn(),
      onSubmit: jest.fn(),
      updatePageHeader: jest.fn(),
      warning: 'warning',
      isLoading: false,
    };

    el = shallow(<AddNoteComposition {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when there is an error', () => {
    el.setProps({ error: true });
    expect(el).toMatchSnapshot();
  });

  it('should render the page correctly when there is loading', () => {
    el.setProps({ isLoading: true });
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should call onSubmit when notes form is submitted', () => {
    el.find('AddNoteForm')
      .props()
      .onSubmit();
    expect(props.onSubmit).toHaveBeenCalled();
  });

  it('should call onBack when notes form is cancelled', () => {
    el.find('AddNoteForm')
      .props()
      .onCancel();
    expect(props.onBack).toHaveBeenCalled();
  });

  it('should call clearError on unmount', () => {
    el.unmount();
    expect(props.clearError).toHaveBeenCalled();
  });
});
