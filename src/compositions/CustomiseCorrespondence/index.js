import React from 'react';
import { NotificationPanel, RadioGroup, Radio, Select, Button } from 'nhh-styles';
import PropTypes from 'prop-types';
import { PageContent } from '../';
import connect from './connect';
import { FieldRow, FormWrapper, NotificationWrapper } from '../../components';
import Attachments from './Attachments';
import DraftCorrespondencePreviewDocuments from './DraftCorrespondencePreviewDocuments';
import GenerateCorrespondence from './GenerateCorrespondence';
import { errorTextLabels, labelsPropTypes } from './types';
import { LETTER, EMAIL, SMS } from '../../constants/correspondenceSendingMethods';
import { CUSTOMER, THIRD_PARTY } from '../../constants/correspondenceRecipients';
import printingMethods, {
  LOCAL,
  MAILING_HOUSE,
} from '../../constants/correspondencePrintingMethods';

const dataBddPrefix = 'CustomiseCorrespondence';

const initialState = {
  errors: {},
  mergeFields: {},
  mailingHouse: '',
  printingMethod: '',
  selectedCaseFiles: [],
  isGenerateCorrespondenceFormValid: false,
};

export class CustomiseCorrespondenceCompositions extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }
  componentDidMount() {
    const {
      correspondenceId,
      redirectToSendCorrespondence,
      templateId,
      getSubstitutionFields,
      updatePageHeader,
    } = this.props;
    updatePageHeader();
    if (templateId && correspondenceId) {
      getSubstitutionFields(templateId);
    } else {
      redirectToSendCorrespondence();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    );
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }

  handleFilesChange = files => {
    this.setState({ selectedCaseFiles: files });
  };

  handleSubmit = eve => {
    eve.preventDefault();
    const payload = {
      exstingDocumentUrlsToAttach: this.state.selectedCaseFiles,
    };
    if (this.props.sendingMethod === LETTER && this.state.printingMethod === MAILING_HOUSE) {
      payload.printer = {
        printerId: this.props.printerOptions.find(
          item => item.friendlyName === this.state.mailingHouse
        ).id,
      };
    }
    this.props.onSubmit(payload);
  };

  updateInputState = ({ target: { dataset, value } }) => {
    this.setState({ [dataset.stateKey]: value });
  };

  validate() {
    const {
      correspondenceDocuments,
      sendingMethod,
      hasMediaErrors,
      fatalError,
      recipient,
      substitutionFields,
    } = this.props;
    const { printingMethod, mailingHouse, isGenerateCorrespondenceFormValid } = this.state;

    const isFormValidatedBySendingMethod =
      recipient === CUSTOMER ||
      (recipient === THIRD_PARTY &&
        ((sendingMethod === LETTER && printingMethod === LOCAL) ||
          (sendingMethod === LETTER && printingMethod === MAILING_HOUSE && mailingHouse) ||
          (sendingMethod === LETTER && !substitutionFields.length) ||
          sendingMethod === EMAIL ||
          sendingMethod === SMS));

    const isDocumentValidated =
      (recipient === THIRD_PARTY && correspondenceDocuments.length) ||
      isGenerateCorrespondenceFormValid ||
      (recipient === CUSTOMER &&
        ((substitutionFields.length && correspondenceDocuments.length) ||
          (!substitutionFields.length && !correspondenceDocuments.length)));

    const isValid =
      // correspondenceDocuments is generated by "GENERATE DRAFT CORRESPONDENCE BUTTON"
      // when recipient is Third Party
      isDocumentValidated &&
      !fatalError &&
      // is a letter and a printingMethod is selected with a mailingHouse option
      isFormValidatedBySendingMethod &&
      // the uploader returned no errors
      !hasMediaErrors;

    return isValid;
  }

  validateHandler = isValid => this.setState({ isGenerateCorrespondenceFormValid: isValid });

  render() {
    const {
      correspondenceDocuments,
      generatePreviewLoading,
      onBack,
      labels: { backButton, submitButton, decline: declineText },
      sendingMethod,
      fatalError,
      isLoading,
    } = this.props;

    const canAddAttachments = [EMAIL, LETTER].includes(sendingMethod);
    const isValid = this.validate();

    return (
      <PageContent>
        <div className="col-lg-9">
          <FormWrapper
            loading={isLoading}
            backButtonText={backButton}
            disablePropertyInformationEditMode
            formName="SendCorrespondence"
            handleBackClick={onBack}
            handleFormSubmit={this.handleSubmit}
            submitButtonText={submitButton}
            disableSubmit={!isValid}
            otherActionsLeft={
              <Button
                data-bdd={'SendCorrespondence-decline'}
                buttonType="secondary"
                isFullWidth
                type="button"
                onClick={this.props.decline}
              >
                {declineText}
              </Button>
            }
          >
            <GenerateCorrespondence
              arrearsId={this.props.arrearsId}
              closeTemplate={this.props.closeTemplate}
              dataBddPrefix={dataBddPrefix}
              errorText={this.props.errorText}
              generatePreviewLoading={this.props.generatePreviewLoading}
              generatePreviewSubmitText={this.props.generatePreviewSubmitText}
              generateDraft={this.props.generateDraft}
              labels={this.props.labels}
              openTemplate={this.props.openTemplate}
              recipient={this.props.recipient}
              retriableError={this.props.retriableError}
              sendingMethod={this.props.sendingMethod}
              substitutionFields={this.props.substitutionFields}
              templateId={this.props.templateId}
              templatePreviewImage={this.props.templatePreviewImage}
              validateHandler={this.validateHandler}
            />
            <DraftCorrespondencePreviewDocuments
              closeTemplate={this.props.closeTemplate}
              dataBddPrefix={dataBddPrefix}
              documents={correspondenceDocuments}
              errorText={this.props.errorText}
              fatalError={fatalError}
              generatePreviewLoading={generatePreviewLoading}
              retriableError={this.props.retriableError}
              labels={this.props.labels}
              openTemplate={this.props.openTemplate}
            />
            {this.props.sendingMethod === LETTER &&
              !!correspondenceDocuments.length && (
                <React.Fragment>
                  <FieldRow>
                    <RadioGroup
                      error={this.state.errors.printMethodMissing}
                      labelText={this.props.labels.letterPrintingMethods}
                      required
                      name="printing-method-radio"
                    >
                      {printingMethods.map(({ id, name }) => (
                        <Radio
                          key={id}
                          checked={this.state.printingMethod === id}
                          data-bdd={`${dataBddPrefix}-printingMethod-${id}`}
                          data-state-key="printingMethod"
                          display="block"
                          id={id}
                          onChange={() =>
                            this.updateInputState({
                              target: { dataset: { stateKey: 'printingMethod' }, value: id },
                            })
                          }
                        >
                          {name}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </FieldRow>
                </React.Fragment>
              )}
            {this.state.printingMethod === MAILING_HOUSE && (
              <React.Fragment>
                {!this.props.printerOptions.length ? (
                  <NotificationWrapper data-bdd={`${dataBddPrefix}-printerMailingHouseNotProvided`}>
                    <NotificationPanel
                      icon="warning"
                      description={this.props.genericContactITErrorText}
                      hideCloseButton
                      show
                    />
                  </NotificationWrapper>
                ) : (
                  <FieldRow>
                    <Select
                      dataBdd={`${dataBddPrefix}-mailingHouse`}
                      data-state-key="mailingHouse"
                      error={this.state.errors.mailingHouseMissing}
                      isFullWidth
                      items={this.props.printerOptions}
                      itemToString={item => (item ? item.friendlyName : '')}
                      labelText={this.props.labels.mailingHouse}
                      onChange={({ friendlyName }) =>
                        this.updateInputState({
                          target: { dataset: { stateKey: 'mailingHouse' }, value: friendlyName },
                        })
                      }
                      required
                      inputValue={this.state.mailingHouse}
                    />
                  </FieldRow>
                )}
              </React.Fragment>
            )}
            {canAddAttachments && (
              <Attachments
                {...this.props.attachmentProps}
                handleFilesChange={this.handleFilesChange}
                selectedCaseFiles={this.state.selectedCaseFiles}
              />
            )}
          </FormWrapper>
        </div>
      </PageContent>
    );
  }
}

CustomiseCorrespondenceCompositions.defaultProps = {
  correspondenceDocuments: [],
  printerOptions: [],
  fatalError: false,
  retriableError: false,
  templateId: '',
  templatePreviewImage: '',
};

CustomiseCorrespondenceCompositions.propTypes = {
  arrearsId: PropTypes.string.isRequired,
  attachmentProps: PropTypes.shape({}).isRequired,
  closeTemplate: PropTypes.func.isRequired,
  correspondenceId: PropTypes.string.isRequired,
  decline: PropTypes.func.isRequired,
  errorText: errorTextLabels.isRequired,
  generateDraft: PropTypes.func.isRequired,
  generatePreviewLoading: PropTypes.bool.isRequired,
  generatePreviewSubmitText: PropTypes.string.isRequired,
  genericContactITErrorText: PropTypes.string.isRequired,
  getSubstitutionFields: PropTypes.func.isRequired,
  hasMediaErrors: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  labels: labelsPropTypes.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  openTemplate: PropTypes.func.isRequired,
  recipient: PropTypes.string.isRequired,
  redirectToSendCorrespondence: PropTypes.func.isRequired,
  sendingMethod: PropTypes.string.isRequired,
  substitutionFields: PropTypes.array.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  correspondenceDocuments: PropTypes.array,
  fatalError: PropTypes.bool,
  printerOptions: PropTypes.array,
  retriableError: PropTypes.bool,
  templateId: PropTypes.string,
  templatePreviewImage: PropTypes.string,
};

export default connect(CustomiseCorrespondenceCompositions);
