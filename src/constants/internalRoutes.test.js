import routes, { getTaskActivityRouteByActionType } from './internalRoutes';

describe('internalRoutes', () => {
  it('generates the correct routes when a payment plan exists', () => {
    const arrearDetails = {
      id: 'abc123',
      paymentPlan: { id: 'def456' },
    };
    expect(routes(arrearDetails)).toMatchSnapshot();
  });

  it('generates the correct routes when there is an active pause', () => {
    const arrearDetails = {
      id: 'abc123',
      pauseSummary: [{ id: 'def456', status: 'Active' }],
    };
    expect(routes(arrearDetails)).toMatchSnapshot();
  });

  it('generates the correct routes when there is a pause awaiting approval and user is an HO', () => {
    const arrearDetails = {
      id: 'abc123',
      pauseSummary: [{ id: 'def456', status: 'Draft' }],
    };
    expect(routes(arrearDetails)).toMatchSnapshot();
  });

  it('generates the correct routes when there is a pause awaiting approval and user is an HM', () => {
    const arrearDetails = {
      id: 'abc123',
      pauseSummary: [{ id: 'def456', status: 'Draft' }],
    };
    expect(routes(arrearDetails, true)).toMatchSnapshot();
  });

  it('generates the correct routes for add interaction', () => {
    expect(getTaskActivityRouteByActionType('addinteraction', 'abc123')).toEqual(
      '/arrears-details/abc123/interaction/create'
    );
  });

  it('generates the correct routes for add note', () => {
    expect(getTaskActivityRouteByActionType('addnote', 'abc123')).toEqual(
      '/arrears-details/abc123/note/create'
    );
  });

  it('generates the correct routes for send correspondence', () => {
    expect(getTaskActivityRouteByActionType('sendcorrespondence', 'abc123')).toEqual(
      '/arrears-details/abc123/send-correspondence/create'
    );
  });

  it('generates the correct routes for legal referral when legalReferralId is NOT provided', () => {
    expect(getTaskActivityRouteByActionType('legalreferral', 'abc123')).toEqual(
      '/arrears-details/abc123/legal-case-referral/create'
    );
  });

  it('generates the correct routes for legal referral when legalReferralId IS provided', () => {
    expect(
      getTaskActivityRouteByActionType('legalreferral', 'ARREARSID', 'LEGALREFERRALID')
    ).toEqual('/arrears-details/ARREARSID/legal-case-referral/LEGALREFERRALID/review');
  });
});
