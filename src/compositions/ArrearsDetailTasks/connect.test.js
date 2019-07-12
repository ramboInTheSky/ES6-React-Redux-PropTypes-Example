import * as modalActions from '../../ducks/modal';
import * as tasksActions from '../../ducks/tasks';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';
import { OPEN, CANCELLED, COMPLETED } from '../../constants/taskStatuses';

describe('ArrearsDashboard connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    modalActions.setModalContent = jest.fn();
    tasksActions.getTasks = jest.fn();
    tasksActions.invalidateTasks = jest.fn();
    ownProps = {
      match: {
        params: {
          arrearsId: '123',
        },
      },
      bar: 'baz',
    };
    mapStateToPropsResult = mapStateToProps(mockState, ownProps);
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(),
      };

      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct action when invalidate fires', () => {
      result.invalidateTasks();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
    });

    describe('openTaskModal', () => {
      it('performs the correct actions when openTaskModal fires', () => {
        const modalContent = 'template content';
        result.openTaskModal(modalContent);
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(modalActions.setModalContent).toHaveBeenCalledWith(modalContent);
      });
    });

    it('performs the correct actions when getArrearTasks fires for Open Tasks', () => {
      result.getArrearTasks(false, { rock: 'roll' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(tasksActions.getTasks).toHaveBeenCalledWith({
        EntityId: '123',
        EntityType: 'Arrears',
        Statuses: OPEN,
        rock: 'roll',
      });
    });

    it('performs the correct actions when getArrearTasks fires for Archived Tasks', () => {
      result.getArrearTasks(true, { rock: 'roll' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(tasksActions.getTasks).toHaveBeenCalledWith({
        EntityId: '123',
        EntityType: 'Arrears',
        Statuses: `${CANCELLED},${COMPLETED}`,
        rock: 'roll',
      });
    });
  });
});
