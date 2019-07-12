import { ACTIVE, DRAFT } from './pause';
import legalReferralStatus from './legalReferral';

export const getActivityHistoryItemRoute = (arrearsId, itemId) =>
  `/arrears-details/${arrearsId || ':arrearsId'}/history/${itemId || ':itemId'}`;

export const getArrearsDetailRoute = arrearsId => `/arrears-details/${arrearsId || ':arrearsId'}`;

export const getArchivedTasksRoute = arrearsId =>
  `/arrears-details/${arrearsId || ':arrearsId'}/archived-tasks`;

export const getTaskActivityRouteByActionType = (actionType, arrearsId, legalReferralId) => {
  const prependedURL = `/arrears-details/${arrearsId}`;
  switch (actionType) {
    case 'addinteraction': {
      return `${prependedURL}/interaction/create`;
    }
    case 'addnote': {
      return `${prependedURL}/note/create`;
    }
    case 'sendcorrespondence': {
      return `${prependedURL}/send-correspondence/create`;
    }
    case 'legalreferral': {
      if (legalReferralId) {
        return `${prependedURL}/legal-case-referral/${legalReferralId}/review`;
      }
      return `${prependedURL}/legal-case-referral/create`;
    }
    default: {
      return '#';
    }
  }
};

export default (
  { id: arrearsId, legalReferral: lr, legalReferralCase, pauseSummary, paymentPlan: pp },
  isManager
) => {
  // paymentPlan routing conditions
  const paymentPlanId = pp ? pp.id : null;

  // pause routing conditions
  const pauses = pauseSummary || [];
  const pauseAwaitingApproval = pauses.filter(pause => pause.status === DRAFT)[0];
  const activePause =
    pauses.filter(pause => pause.status === ACTIVE)[0] || pauseAwaitingApproval || {};
  let pauseAction;
  if (activePause.id) pauseAction = 'update';
  if (pauseAwaitingApproval && isManager) pauseAction = 'approve';

  // legalReferral routing conditions
  const legalReferralActionStatus = legalReferralCase ? legalReferralCase.status : null;
  const currentLegalReferralAction = lr ? lr.caseId : null;
  const legalReferralActionType =
    legalReferralActionStatus === legalReferralStatus.requiresApproval ? 'approve' : 'review';

  const linkToPage = (type, typeId, action) =>
    `/arrears-details/${arrearsId}/${type}/${typeId || 'create'}${
      typeId && action ? `/${action}` : ''
    }`;

  return {
    addNote: linkToPage('note'),
    addTask: linkToPage('task'),
    arrearsDetailNOSPModal: `/arrears-details/${arrearsId}?modal=serveNOSP`,
    interaction: linkToPage('interaction'),
    legalReferral: linkToPage(
      'legal-case-referral',
      currentLegalReferralAction,
      legalReferralActionType
    ),
    pause: linkToPage('pause-arrears-case', activePause.id, pauseAction),
    paymentPlan: linkToPage('payment-plan', paymentPlanId),
    sendCorrespondence: linkToPage('send-correspondence'),
    tenancySustainmentReferral: linkToPage('refer-arrears-case'),
  };
};
