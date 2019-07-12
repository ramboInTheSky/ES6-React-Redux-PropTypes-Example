import * as actions from '../../ducks/ribbon';
import * as legalReferralActions from '../../ducks/legalReferral';
import * as notificationActions from '../../ducks/notifications';

import { mapStateToProps, mergeProps } from './connect';
import state from '../../../__mocks__/state';

jest.mock('../../util/downloadFile', () => (uri, name) => ({ uri, name }));

describe('ApproveLegalCaseReferral connector', () => {
  let mockState;
  let mapStateToPropsResult;
  let ownProps;

  beforeEach(() => {
    mockState = state();
    ownProps = {
      bar: 'baz',
      match: {
        params: {
          arrearsId: 'foo',
          submissionId: 'abc123',
        },
      },
    };
    mapStateToPropsResult = mapStateToProps(mockState, ownProps);
  });

  describe('mapStateToProps', () => {
    it('generates the correct props', () => {
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
    it('generates the correct props for a housing manager', () => {
      mapStateToPropsResult = mapStateToProps(
        { ...mockState, user: { ...mockState.user, userType: 'manager' } },
        ownProps
      );
      expect(mapStateToPropsResult).toMatchSnapshot();
    });
  });

  describe('mergeProps', () => {
    let dispatchProps;
    let result;
    let redirectToDetailsPage;

    beforeEach(() => {
      dispatchProps = {
        dispatch: jest.fn(() => ({
          then: cb => {
            cb();
            return { catch: () => {} };
          },
        })),
      };
      actions.updateRibbon = jest.fn();
      legalReferralActions.cancelLegalReferral = jest.fn();
      legalReferralActions.getLegalReferral = jest.fn();
      legalReferralActions.setLegalReferralApproved = jest.fn();
      notificationActions.addNotification = jest.fn();
      redirectToDetailsPage = jest.fn();

      result = mergeProps(
        { ...mapStateToPropsResult, redirectToDetailsPage },
        dispatchProps,
        ownProps
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('generates the correct props', () => {
      expect(result).toMatchSnapshot();
    });

    it('performs the correct actions for updatePageHeader', () => {
      result.updatePageHeader();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(actions.updateRibbon).toHaveBeenCalled();
    });

    it('performs the correct actions for getLegalReferral', () => {
      result.getLegalReferral();
      expect(dispatchProps.dispatch).toHaveBeenCalled();
      expect(legalReferralActions.getLegalReferral).toHaveBeenCalledWith(
        mapStateToPropsResult.submissionId
      );
    });

    it('performs the correct actions for onBack', () => {
      result.onBack();
      expect(redirectToDetailsPage).toHaveBeenCalled();
    });

    it('performs the correct actions for downloadFile', () => {
      const file = result.downloadFile('abc123', 'foo');
      expect(file).toEqual({ uri: 'abc123', name: 'foo' });
    });

    describe('onSubmit', () => {
      it('performs the correct actions for an approval', () => {
        result.onSubmit();
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(legalReferralActions.setLegalReferralApproved).toHaveBeenCalledWith('abc123');
        const addNotification = notificationActions.addNotification.mock.calls[0][0];
        expect(notificationActions.addNotification).toHaveBeenCalled();
        expect(addNotification).toMatchSnapshot();
        expect(redirectToDetailsPage).toHaveBeenCalled();
      });

      it('performs the correct actions for onCancel', () => {
        result.onSubmit('Reasons');
        expect(dispatchProps.dispatch).toHaveBeenCalled();
        expect(legalReferralActions.cancelLegalReferral).toHaveBeenCalledWith('abc123', {
          noteText: 'Reasons',
        });
        const addNotification = notificationActions.addNotification.mock.calls[0][0];
        expect(notificationActions.addNotification).toHaveBeenCalled();
        expect(addNotification).toMatchSnapshot();
        expect(redirectToDetailsPage).toHaveBeenCalled();
      });
    });
  });
});
