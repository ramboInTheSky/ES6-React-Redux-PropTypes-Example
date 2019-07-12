import * as actions from '../../ducks/ribbon';
import * as arrearsActions from '../../ducks/arrears';
import * as tasksActions from '../../ducks/tasks';
import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

describe('ArrearsDashboard connector', () => {
  let mockState;
  let mapStateToPropsResult;

  beforeEach(() => {
    mockState = state();
    arrearsActions.updateFiltersAndFetchResults = jest.fn();
    arrearsActions.getStatuses = jest.fn();
    tasksActions.getTasksSummary = jest.fn();
    tasksActions.getStatuses = jest.fn();
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      mapStateToPropsResult = mapStateToProps(mockState);
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let ownProps;
    let result;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(),
      };
      ownProps = { bar: 'baz' };
      actions.updateRibbon = jest.fn();
      actions.onOpenPatchSelect = jest.fn();
      result = mergeProps(mapStateToPropsResult, dispatchProps, ownProps);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct actions when getArrearsSummary fires', () => {
      result.getArrearsSummary({ rock: 'roll' }, { foo: 'bar' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(arrearsActions.updateFiltersAndFetchResults).toHaveBeenCalledWith(
        {
          patches: 'PTCPRH01',
          rock: 'roll',
        },
        { foo: 'bar' }
      );
    });

    it('performs the correct actions when getArrearStatuses fires', () => {
      result.getArrearStatuses({ rock: 'roll' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(arrearsActions.getStatuses).toHaveBeenCalledWith({
        patches: 'PTCPRH01',
        rock: 'roll',
      });
    });

    it('performs the correct actions when getTasksSummary fires', () => {
      result.getTasksSummary({ rock: 'roll' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(tasksActions.getTasksSummary).toHaveBeenCalledWith({
        EntityType: 'Arrears',
        patches: 'PTCPRH01',
        rock: 'roll',
        statuses: 'open',
      });
    });

    it('performs the correct actions when getTaskStatuses fires', () => {
      result.getTaskStatuses({ rock: 'roll' });
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(tasksActions.getStatuses).toHaveBeenCalledWith({
        EntityType: 'Arrears',
        patches: 'PTCPRH01',
        rock: 'roll',
      });
    });
  });
});
