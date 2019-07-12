import { getPauseDetails, getPaymentPlanDetails } from './selectors';

describe('ArrearsDetails selectors', () => {
  const labels = {
    installmentArrangementFormat: '{amount} Every {period} {schedule}(s)',
    lengthOfArrears: 'Length of arrears',
    lengthOfArrearsValue: '{days} days (case started on {date})',
    none: 'None',
    patchOwner: 'Patch owner',
    pauses: {
      active: '(active)',
      draftLabel: 'Draft pauses',
      draftPausePeriod: 'Requested from {from} to {to}',
      label: 'Pauses',
      pausePeriod: 'Paused from {from} to {to}',
      pendingApproval: '(pending approval)',
    },
    paymentPlan: {
      endDate: 'End date:',
      frequency: 'Frequency:',
      instalmentAmount: 'Instalment amount:',
      label: 'Payment plan',
      period: 'Period:',
      startDate: 'Start date:',
      type: 'Type:',
    },
    referralStatus: {
      label: 'Referrals',
      value: '{team}, {date}',
    },
    status: 'Arrears status',
    workwiseReference: 'Workwise reference',
  };

  describe('getPauseDetails', () => {
    it('renders correctly when not draft', () => {
      expect(
        getPauseDetails(
          {
            startDate: '2018-07-15T13:12:07.193Z',
            expiryDate: '2017-04-23T13:12:07.193Z',
          },
          labels
        )
      ).toMatchSnapshot();
    });

    it('renders correctly when extended', () => {
      expect(
        getPauseDetails(
          {
            startDate: '2018-07-15T13:12:07.193Z',
            expiryDate: '2017-04-23T13:12:07.193Z',
            isExtended: true,
          },
          labels
        )
      ).toMatchSnapshot();
    });

    it('renders correctly when draft', () => {
      expect(
        getPauseDetails(
          {
            startDate: '2018-07-15T13:12:07.193Z',
            expiryDate: '2017-04-23T13:12:07.193Z',
          },
          labels,
          'draft'
        )
      ).toMatchSnapshot();
    });
  });

  describe('getPaymentPlanDetails', () => {
    it('renders correctly', () => {
      expect(
        getPaymentPlanDetails(
          {
            startDate: '2018-07-15T13:12:07.193Z',
            endDate: '2017-04-23T13:12:07.193Z',
            installment: {
              amount: 12,
              schedule: 'Weekly',
              period: 1,
            },
            type: 'Fred',
          },
          labels
        )
      ).toMatchSnapshot();
    });
  });
});
