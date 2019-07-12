import React from 'react';
import { shallow } from 'enzyme';

import { ArrearsDashboardComposition } from './';

describe('<ArrearsDashboardComposition />', () => {
  let props;
  let el;

  beforeEach(() => {
    props = {
      cardLabels: {
        address: 'Address',
        currentBalance: 'Current balance',
        heading: 'Arrears',
        notificationDate: 'Notification date',
        openTasks: 'Open tasks',
        tenantName: 'Tenant name',
      },
      taskCardLabels: {
        heading: 'Tasks',
        dueDate: 'Due Date',
        taskOwner: 'Task Owner',
        title: 'Title',
        customerName: 'Customer Name',
        address: 'Address',
        status: 'Status',
        overdue: 'overdue!',
      },
      arrears: [],
      tasks: [],
      arrearsNoDataMsg: 'Gotham is in danger',
      tasksNoDataMsg: 'Gotham is in danger',
      heading: 'titleText',
      updatePageHeader: jest.fn(),
      getTasksSummary: jest.fn(),
      getArrearStatuses: jest.fn(),
      getTaskStatuses: jest.fn(),
      arrearStatuses: {},
      taskStatuses: {},
      loadingArrears: false,
      loadingTasks: false,
      profile: {
        id: 'ABC123',
        patchName: 'Hello world',
      },
      patches: [
        {
          name: 'John Smith',
          patchName: 'Hello world',
        },
        {
          name: 'Jane Smith',
          patchName: 'Some other name',
        },
      ],
      getArrearsSummary: jest.fn(),
      onOpenPatchSelect: jest.fn(),
      invalidateTasks: jest.fn(),
    };

    el = shallow(<ArrearsDashboardComposition {...props} />);
  });

  it('should render the page', () => {
    expect(el).toMatchSnapshot();
  });

  it('should render the page while loading arrears and tasks', () => {
    el.setProps({
      loadingArrears: true,
      loadingTasks: true,
    }).update();
    expect(el).toMatchSnapshot();
  });

  it('should update the header', () => {
    expect(props.updatePageHeader).toHaveBeenCalled();
  });

  it('should call getTaskSummary', () => {
    expect(props.getTasksSummary).toHaveBeenCalled();
  });

  it('should call invalidateTasks on UnMount', () => {
    el.unmount();
    expect(props.invalidateTasks).toHaveBeenCalled();
  });
});
