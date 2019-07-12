import React from 'react';
import { shallow } from 'enzyme';
import * as nhhStyles from 'nhh-styles';
import { Note } from './Note';

nhhStyles.formatting.formatDate = jest.fn(() => '10/08/2018 - 8:52pm');

describe('<Note />', () => {
  let props;

  beforeEach(() => {
    props = {
      note: {
        id: 'e2054c02-08dd-e811-80d2-005056825b41',
        caseId: '00000000-0000-0000-0000-000000000000',
        created: { by: null, on: '2018-10-31T12:25:13+00:00' },
        modified: { by: null, on: '2018-10-31T12:25:13+00:00' },
        subject: 'usman-moses',
        text: 'This is a test note with attachment :)',
      },
    };
  });

  it('renders correctly', () => {
    expect(shallow(<Note {...props.note} />)).toMatchSnapshot();
  });
});
