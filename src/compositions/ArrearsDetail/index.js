import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import pathOr from 'ramda/src/pathOr';
import format from 'string-format';
import qs from 'qs';
import { Button, Colorize, formatting, icons, Loader, PhaseIndicator } from 'nhh-styles';

import { PageContent, PropertyInformation, ServeNOSPEarly, TenancyTransactions } from '../';
import connect from './connect';

import ArrearsDetails, { detailsPropTypes, labelPropTypes } from '../../components/ArrearsDetails';
import { NoteList } from '../../components/Notes/NoteList';
import { DocumentsList } from '../../components/DocumentsList';

import LegalActions, {
  legalActionPropTypes,
  legalActionsPropTypes,
  referralPackPropTypes,
} from '../../components/LegalActions';

import { CustomerDetailsContainer, LinkedItems, Wrapper } from './components';
import ArrearsActions from '../ArrearsActions';
import ActivityHistory from '../ActivityHistory';
import ArrearsDetailTasks from '../ArrearsDetailTasks';

export class ArrearsDetailComposition extends PureComponent {
  constructor(props) {
    super(props);
    this.legalActionNotificationDidDisplay = false;
  }

  componentDidMount() {
    this.props.updatePageHeader();
    this.showNotifications(this.props);
    this.props.notes.getList();
    this.props.documents.getList();
  }

  componentWillReceiveProps(nextProps) {
    this.showNotifications(nextProps);
    if (nextProps.modalToShow && !nextProps.aModalIsVisible) {
      let template;
      switch (nextProps.modalToShow) {
        case 'serveNOSP':
          template = <ServeNOSPEarly arrearsId={this.props.arrearsId} />;
          break;
        default:
      }

      if (template) {
        this.props.openTemplate(template);
        nextProps.redirectToDetailsPage();
      }
    }
    if (this.props.partyId !== nextProps.partyId) {
      nextProps.getTenancyTransactions();
    }
  }

  componentWillUnmount() {
    this.props.removeNotification();
  }

  getQueryStringParams = props => qs.parse(props.location.search, { ignoreQueryPrefix: true });

  showNotifications = props => {
    if (
      pathOr(false, ['arrearsDetail', 'primaryLegalAction', 'notifyOfPendingExpiry'], props) &&
      !this.legalActionNotificationDidDisplay
    ) {
      const {
        arrearsDetail: { primaryLegalAction },
        legalActions: { expiryDate, headingExpiring, labels },
      } = props;
      const expiresLabel = labels && labels.expires;
      const expiresOn = format(expiryDate, {
        date: formatting.formatDate(primaryLegalAction.expiryDate),
      });
      this.props.addNotification({
        dataBddPrefix: 'legalActionNotification',
        icon: 'warning',
        lines: [
          { dataBdd: 'expirydate', text: primaryLegalAction.title },
          { dataBdd: 'expiresOn', text: `${expiresLabel} ${expiresOn}` },
        ],
        notificationType: 'legal',
        title: headingExpiring,
      });
      this.legalActionNotificationDidDisplay = true;

      const { notificationIcon, notificationTitle, notificationBody } = this.getQueryStringParams(
        props
      );

      if (notificationIcon && notificationTitle && notificationBody) {
        this.props.addNotification({
          dataDbbPrefix: 'externalAppNotification',
          icon: notificationIcon,
          title: notificationTitle,
          lines: notificationBody
            .split('\n')
            .map((line, i) => ({ dataBdd: `externalNotificationLine${i}`, text: line })),
        });
      }
    }
  };

  render() {
    const {
      arrearsDetail,
      arrearsDetailsLabels,
      informationHeading,
      legalActions: legalActionsText,
      linkedItemsButton,
      loadTenancyTransactions,
      phasesHeading,
      rentDetail,
      notes,
      documentLabels,
      documents,
      genericErrorText,
    } = this.props;

    if (!arrearsDetail || !arrearsDetail.allDetails) {
      return (
        <PageContent>
          <Loader />
        </PageContent>
      );
    }

    const { legalReferral: lr, phases, primaryLegalAction, referralPack } = arrearsDetail;

    const activePhase = (phases || []).findIndex(phase => phase.current);
    const legalReferral = lr ? { ...lr, referralPack } : null;
    const legalActions = { ...legalActionsText, legalReferral, primaryLegalAction };

    const arrearsDetailsProps = {
      ...arrearsDetail,
      rentDetail,
    };

    return (
      <PageContent>
        <div className="col-lg-9">
          <Wrapper>
            <CustomerDetailsContainer>
              <PropertyInformation />
            </CustomerDetailsContainer>
            <ArrearsDetails
              {...arrearsDetailsProps}
              heading={informationHeading}
              labels={arrearsDetailsLabels}
            />
            {!!linkedItemsButton && (
              <LinkedItems>
                <Button
                  data-bdd="linkedItemsButton"
                  href={linkedItemsButton.href}
                  icon={<Colorize hasHoverState={false}>{icons.circleArrowRight}</Colorize>}
                  isText
                >
                  {linkedItemsButton.text}
                </Button>
              </LinkedItems>
            )}
            {(!!legalReferral || !!primaryLegalAction) && <LegalActions {...legalActions} />}
            <ArrearsDetailTasks />
            {loadTenancyTransactions && <TenancyTransactions />}
            <br />
            {!documents.loading && documents.loaded ? (
              <DocumentsList
                labels={documentLabels}
                documents={documents.downloadedFiles}
                downloadFile={documents.downloadFile}
                error={{ errorCode: documents.downloadError, message: genericErrorText }}
              />
            ) : (
              <Loader />
            )}
            <ActivityHistory />
            {!notes.loading && notes.loaded ? (
              <NoteList notes={notes.items} heading={'Notes ({count})'} />
            ) : (
              <Loader />
            )}
          </Wrapper>
        </div>
        <aside className="col-lg-3">
          {!!phases &&
            !!phases.length && (
              <PhaseIndicator
                activePhaseIndex={activePhase}
                phases={phases}
                title={phasesHeading}
              />
            )}
          <ArrearsActions />
        </aside>
      </PageContent>
    );
  }
}

ArrearsDetailComposition.defaultProps = {
  aModalIsVisible: false,
  arrearsDetail: null,
  arrearsId: '',
  linkedItemsButton: null,
  modalToShow: null,
  nospServeError: false,
  partyId: null,
  rentDetail: null,
};

ArrearsDetailComposition.propTypes = {
  addNotification: PropTypes.func.isRequired,
  arrearsDetailsLabels: PropTypes.shape(labelPropTypes).isRequired,
  closeTemplate: PropTypes.func.isRequired,
  documentLabels: PropTypes.shape({}).isRequired,
  documents: PropTypes.shape({
    downloadedFiles: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    getList: PropTypes.func.isRequired,
    invalidateList: PropTypes.func.isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    downloadError: PropTypes.number,
  }).isRequired,
  genericErrorText: PropTypes.string.isRequired,
  getTenancyTransactions: PropTypes.func.isRequired,
  informationHeading: PropTypes.string.isRequired,
  legalActions: PropTypes.shape(legalActionsPropTypes).isRequired,
  loadTenancyTransactions: PropTypes.bool.isRequired,
  notes: PropTypes.shape({
    error: PropTypes.bool.isRequired,
    getList: PropTypes.func.isRequired,
    invalidateList: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
  }).isRequired,
  openTemplate: PropTypes.func.isRequired,
  phasesHeading: PropTypes.string.isRequired,
  redirectToDetailsPage: PropTypes.func.isRequired,
  removeNotification: PropTypes.func.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  aModalIsVisible: PropTypes.bool,
  arrearsDetail: PropTypes.shape({
    ...detailsPropTypes,
    legalReferral: PropTypes.shape(legalActionPropTypes),
    phases: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        current: PropTypes.bool,
      })
    ),
    primaryLegalAction: PropTypes.shape(legalActionPropTypes),
    refferalPack: PropTypes.shape(referralPackPropTypes),
  }),
  arrearsId: PropTypes.string,
  linkedItemsButton: PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }),
  modalToShow: PropTypes.string,
  nospServeError: PropTypes.bool,
  partyId: PropTypes.string,
  rentDetail: PropTypes.shape({}),
};

export default connect(ArrearsDetailComposition);
