import React from 'react';
import { shallow } from 'enzyme';

import { ActivityHistoryComposition } from './';

describe('<ActivityHistoryComposition />', () => {
  let props;
  let activity;
  let el;

  beforeEach(() => {
    activity = id => ({
      createdBy: {
        displayName: 'Fred',
      },
      description: 'A description',
      id,
      modifiedAt: '2018-08-31T20:52:35+00:00',
      type: 'Email',
    });

    props = {
      arrearsId: 'ABC123',
      getActivityHistory: jest.fn(),
      invalidateActivityHistory: jest.fn(),
      heading: 'A heading',
      labels: {
        date: 'date',
        detail: 'detail',
        name: 'name',
      },
      activityHistory: [activity('abc123'), activity('def456')],
    };

    el = shallow(<ActivityHistoryComposition {...props} />);
  });

  it('should call getActivityHistory', () => {
    expect(props.getActivityHistory).toHaveBeenCalled();
  });

  it('should render with activities', () => {
    expect(el).toMatchSnapshot();
  });

  it('should not render with no activities', () => {
    el.setProps({
      activityHistory: [],
    });
    expect(el).toMatchSnapshot();
  });

  it('should call invalidateTasks on UnMount', () => {
    el.unmount();
    expect(props.invalidateActivityHistory).toHaveBeenCalled();
  });
});
