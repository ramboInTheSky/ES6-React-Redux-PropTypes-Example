import { connect } from 'react-redux';
import path from 'ramda/src/path';
import moment from 'moment';
import pipe from 'ramda/src/pipe';
import prop from 'ramda/src/prop';
import flip from 'ramda/src/flip';
import find from 'ramda/src/find';
import whereEq from 'ramda/src/whereEq';
import where from 'ramda/src/where';
import evolve from 'ramda/src/evolve';
import filter from 'ramda/src/filter';
import contains from 'ramda/src/contains';
import { tap } from 'nhh-styles';
import qs from 'qs';

import { employeeDashboard } from '../../constants/routes';
import getHelpers from '../../util/stateHelpers';
import { updateRibbon } from '../../ducks/ribbon';
import { addNotification, removeNotification } from '../../ducks/notifications';
import { getNotesByCaseId, invalidateNotes } from '../../ducks/notes';
import { getFilesByCaseId, invalidateDownloadedFiles } from '../../ducks/media';
import { setModalContent } from '../../ducks/modal';
import { getAccountsTransactions } from '../../ducks/customer';
import downloadFile from '../../util/downloadFile';

const RENT_ACCOUNT_TYPE_CODE = 'REN';
const CHARGE_CODES_TO_SHOW = ['SERV', 'FPARK', 'CPPK'];

const getFrom = flip(prop);
const isIncludedIn = flip(contains);

export const findRentAccount = frequencies =>
  pipe(
    path(['customer', 'accounts']),
    find(whereEq({ typeCode: RENT_ACCOUNT_TYPE_CODE })),
    evolve({
      paymentFrequency: getFrom(frequencies),
      charges: filter(where({ chargeCode: isIncludedIn(CHARGE_CODES_TO_SHOW) })),
    })
  );

export const mapStateToProps = (state, ownProps) => {
  const { get, getBreadcrumbs, pickFrom, getString } = getHelpers(state);
  const {
    arrearsDetails: {
      documents,
      frequencies,
      arrearsDetailsLabels,
      heading,
      informationHeading,
      legalActions,
      linkedItemsButton,
      phasesHeading,
    },
    paymentPlan: { installmentArrangementFormat },
  } = state.dictionary;

  const arrearsId = path(['match', 'params', 'arrearsId'], ownProps);
  const leadTenant = get(['tenancy', 'tenants', 0], {});
  const hasAccounts = !!get(['customer', 'accounts']);
  const genericErrorText = getString(['genericErrorText']);
  const queryParams = qs.parse(ownProps.location.search, { ignoreQueryPrefix: true });
  const redirectToDetailsPage = () => ownProps.history.push(`/arrears-details/${arrearsId}`);
  return {
    aModalIsVisible: get(['modal', 'visible']),
    arrears: get(['arrears', 'items']),
    arrearsId,
    notes: get(['notes']),
    documentLabels: documents,
    documents: pickFrom(['downloadedFiles', 'downloadError', 'loading', 'loaded'], 'media'),
    arrearsDetailsLabels: { installmentArrangementFormat, ...arrearsDetailsLabels },
    breadcrumb: getBreadcrumbs(heading),
    heading,
    genericErrorText,
    informationHeading,
    loadTenancyTransactions: !!Object.keys(leadTenant).length,
    legalActions,
    modalToShow: queryParams.modal,
    partyId: leadTenant.partyIdentifier,
    redirectToDetailsPage,
    linkedItemsButton: leadTenant.contactId
      ? {
          text: linkedItemsButton,
          href: `${employeeDashboard}/customer/${leadTenant.contactId}`,
        }
      : null,
    phasesHeading,
    rentDetail: tap(hasAccounts && findRentAccount(frequencies)(state), rentAccount => ({
      ...rentAccount,
    })),
  };
};

export const mergeProps = (
  { arrears, arrearsId, breadcrumb, notes, partyId, heading, documents, ...stateProps },
  { dispatch },
  ownProps
) => {
  const arrearsDetail = arrears.find(i => i.id === arrearsId);

  return {
    ...stateProps,
    arrearsDetail,
    arrearsId,
    partyId,
    closeTemplate: () => dispatch(setModalContent()),
    documents: {
      ...documents,
      downloadFile: (uri, filename) => downloadFile(uri, filename),
      invalidateList: () => dispatch(invalidateDownloadedFiles()),
      getList: () => dispatch(getFilesByCaseId(arrearsId)),
    },
    updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
    addNotification: props => dispatch(addNotification(props)),
    notes: {
      ...notes,
      invalidateList: () => dispatch(invalidateNotes()),
      getList: () => dispatch(getNotesByCaseId(arrearsId)),
    },
    openTemplate: template => {
      dispatch(setModalContent(template));
    },
    removeNotification: notificationType => dispatch(removeNotification(notificationType)),
    getTenancyTransactions: () => {
      const startDate = moment
        .utc()
        .subtract(12, 'month')
        .format('YYYY-MM-DD');
      dispatch(getAccountsTransactions(partyId, { startDate })).catch(() => {});
    },
    ...ownProps,
  };
};

export default connect(
  mapStateToProps,
  null,
  mergeProps
);
