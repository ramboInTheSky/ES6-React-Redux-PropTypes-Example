import { NotificationPanel } from 'nhh-styles';
import path from 'ramda/src/path';
import React from 'react';
import { shallow } from 'enzyme';
import { FormWrapper } from '../../components';

import Attachments from './Attachments';

import Dictionary from '../../constants/dictionary';
import { CustomiseCorrespondenceCompositions } from './';
import { LETTER, EMAIL, SMS } from '../../constants/correspondenceSendingMethods';
import { MAILING_HOUSE } from '../../constants/correspondencePrintingMethods';
import { CUSTOMER, THIRD_PARTY } from '../../constants/correspondenceRecipients';

jest.mock('date-fns/start_of_today', () => () => new Date('2018-08-01'));

const dictionary = Dictionary();

function sel(id) {
  return `[data-state-key="${id}"]`;
}

const defaultProps = {
  arrearsId: '123123',
  attachmentProps: {
    pendingFiles: [],
    downloadedFiles: [],
    clearMediaState: jest.fn(),
    getFilesByCaseId: jest.fn(),
    hasGeneratedCorrespondence: false,
    mandatoryAttachments: [],
    onChange: jest.fn(),
    onRemove: jest.fn(),
    onRetry: jest.fn(),
    dictionary: {},
  },
  decline: jest.fn(),
  closeTemplate: jest.fn(),
  correspondenceId: '',
  errorText: path(['correspondence', 'errorText'], dictionary),
  generateDraft: () => {},
  generatePreviewError: false,
  generatePreviewLoading: false,
  generatePreviewSubmitText: 'Generate Draft Correspondance',
  genericContactITErrorText:
    'We have encountered an issue whilst trying to retrieve this information. If the issue persists, contact your IT team',
  getSubstitutionFields: jest.fn(),
  labels: path(['correspondence', 'labels'], dictionary),
  onBack: jest.fn(),
  onSubmit: jest.fn(),
  onUnmount: jest.fn(),
  openTemplate: jest.fn(),
  printerOptions: [
    {
      friendlyName: 'some friendly name',
      id: '96e93dec-2558',
    },
  ],
  recipient: 'Customer',
  redirectToSendCorrespondence: jest.fn(),
  sendingMethod: '',
  isLoading: false,
  hasMediaErrors: false,
  substitutionFields: [
    {
      description: 'Some description',
      key: 'mergefield1',
      label: 'Some label',
      mandatory: true,
      validation: "/^[a-z ,.'-]+$/i",
    },
    {
      description: 'Some description',
      key: 'mergefield2',
      label: 'Some label',
      mandatory: true,
      validation: "/^[a-z ,.'-]+$/i",
    },
  ],
  templateId: '',
  templatePreviewImage: 'templatePreview',
  updatePageHeader: jest.fn(),
};

const correspondenceDocuments = [
  {
    content: 'JVBERi0xLjUNCjQgMCBvYmoNCjw8L1R5cGUgL1BhZ2UvUGFyZW',
    encodingType: 'Pdf',
    errorMessages: { failures: null },
    id: 'asdasd213123',
    loading: false,
    recipientName: 'recipient name',
    sendingMethod: 'Post',
    status: 'Success',
    type: 'Letter',
  },
];

const render = props =>
  shallow(<CustomiseCorrespondenceCompositions {...defaultProps} {...props} />);

describe('<CustomiseCorrespondenceCompositions />', () => {
  const preventDefault = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it('should call updatePageHeader', () => {
    const updatePageHeader = jest.fn();
    render({ updatePageHeader });
    expect(updatePageHeader).toHaveBeenCalled();
  });

  it('should call getSubstitutionFields when templateId and correspondenceId are specified', () => {
    const getSubstitutionFields = jest.fn();
    const templateId = 'templateId';
    const correspondenceId = 'correspondenceId';
    render({ correspondenceId, templateId, getSubstitutionFields });
    expect(getSubstitutionFields).toHaveBeenCalledWith(templateId);
  });

  it('should call redirectToSendCorrespondence if templateId or correspondenceId dont exist', () => {
    const correspondenceId = '';
    const redirectToSendCorrespondence = jest.fn();
    const templateId = '';
    render({ correspondenceId, redirectToSendCorrespondence, templateId });
    expect(redirectToSendCorrespondence).toHaveBeenCalled();
  });

  it('should show a list printng methods when sending method is LETTER and correspondence documents have loaded', () => {
    const wrapper = render({
      correspondenceDocuments,
      sendingMethod: LETTER,
    });

    expect(wrapper.find(sel('printingMethod')).length).toBeGreaterThan(0);
    expect(wrapper.find(sel('printingMethod'))).toMatchSnapshot();
  });

  it('should show a warning when mailing house printing method is selected but there are no printer options', () => {
    const wrapper = render({
      correspondenceDocuments,
      printerOptions: [],
      sendingMethod: LETTER,
    });
    wrapper.setState({
      printingMethod: MAILING_HOUSE,
    });
    wrapper.update();
    expect(wrapper.find(NotificationPanel).exists()).toBe(true);
  });

  it('should show a list of mailing house printing options when mailing house printing method is selected ', () => {
    const wrapper = render({
      correspondenceDocuments,
      sendingMethod: LETTER,
    });
    wrapper.setState({
      printingMethod: MAILING_HOUSE,
    });
    wrapper.update();
    expect(wrapper.find(sel('mailingHouse'))).toMatchSnapshot();
  });

  it('should show Attachments component, if printingMethod is either EMAIL or LETTER', () => {
    [LETTER, EMAIL].forEach(method => {
      const wrapper = render({
        correspondenceDocuments,
        sendingMethod: method,
      });

      expect(wrapper.find(Attachments)).toExist();
    });

    const wrapper = render({
      correspondenceDocuments,
      sendingMethod: SMS,
    });

    expect(wrapper.find(Attachments)).not.toExist();
  });

  describe('Form validations', () => {
    const submitForm = currentEl =>
      currentEl
        .find(FormWrapper)
        .props()
        .handleFormSubmit({ preventDefault });

    describe('Customer validation AND SUBMIT when there are no substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [],
        sendingMethod: '',
        hasMediaErrors: false,
        fatalError: false,
        recipient: CUSTOMER,
        substitutionFields: [],
      });
      it('should have Submit button active', () => {
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Customer validation AND SUBMIT when there are substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Post',
          },
        ],
        sendingMethod: '',
        hasMediaErrors: false,
        fatalError: false,
        recipient: CUSTOMER,
        substitutionFields: [
          {
            description: 'Current contact details',
            key: 'mergefield1',
            label: 'Current contact details',
            mandatory: true,
            validation: "/^[a-z ,.'-]+$/i",
          },
        ],
      });
      it('should have Submit button active', () => {
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Third Party SMS validation AND SUBMIT when there are no substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [],
        sendingMethod: SMS,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        substitutionFields: [],
      });
      it('should have Submit button active', () => {
        wrapper.setState({ isGenerateCorrespondenceFormValid: true }).update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Third Party EMAIL validation AND SUBMIT when there are no substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [],
        sendingMethod: EMAIL,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        substitutionFields: [],
      });
      it('should have Submit button active', () => {
        wrapper.setState({ isGenerateCorrespondenceFormValid: true }).update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Third Party LETTER validation AND SUBMIT when there are no substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [],
        sendingMethod: LETTER,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        substitutionFields: [],
        printerOptions: [{ friendlyName: 'a mailing house choice', id: 'ID' }],
      });
      it('should have Submit button active', () => {
        wrapper
          .setState({
            isGenerateCorrespondenceFormValid: true,
            printingMethod: MAILING_HOUSE,
            mailingHouse: 'a mailing house choice',
          })
          .update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          exstingDocumentUrlsToAttach: [],
          printer: { printerId: 'ID' },
        });
      });
    });

    describe('Third Party EMAIL validation AND SUBMIT when there are substitutions', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Post',
          },
        ],
        sendingMethod: EMAIL,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        substitutionFields: [
          {
            description: 'Current contact details',
            key: 'mergefield1',
            label: 'Current contact details',
            mandatory: true,
            validation: "/^[a-z ,.'-]+$/i",
          },
        ],
      });
      it('should have Submit button active', () => {
        wrapper.setState({ isGenerateCorrespondenceFormValid: true }).update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({ exstingDocumentUrlsToAttach: [] });
      });
    });

    describe('Third Party EMAIL validation AND SUBMIT when there are substitutions and attachments', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Post',
          },
        ],
        sendingMethod: EMAIL,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        substitutionFields: [
          {
            description: 'Current contact details',
            key: 'mergefield1',
            label: 'Current contact details',
            mandatory: true,
            validation: "/^[a-z ,.'-]+$/i",
          },
        ],
      });
      it('should have Submit button active', () => {
        wrapper
          .setState({ isGenerateCorrespondenceFormValid: true, selectedCaseFiles: ['fileURI'] })
          .update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          exstingDocumentUrlsToAttach: ['fileURI'],
        });
      });
    });

    describe('Third Party LETTER validation AND SUBMIT when there are substitutions and attachments', () => {
      const wrapper = render({
        correspondenceDocuments: [
          {
            errorType: null,
            id: 'cddd8bb3-c8f3-e811-80d3-005056825b41',
            loading: true,
            recipientName: 'MONA MOSES',
            sendingMethod: 'Post',
          },
        ],
        sendingMethod: LETTER,
        hasMediaErrors: false,
        fatalError: false,
        recipient: THIRD_PARTY,
        printerOptions: [{ friendlyName: 'a mailing house choice', id: 'ID' }],
        substitutionFields: [
          {
            description: 'Current contact details',
            key: 'mergefield1',
            label: 'Current contact details',
            mandatory: true,
            validation: "/^[a-z ,.'-]+$/i",
          },
        ],
      });
      it('should have Submit button active', () => {
        wrapper
          .setState({
            isGenerateCorrespondenceFormValid: true,
            printingMethod: MAILING_HOUSE,
            mailingHouse: 'a mailing house choice',
            selectedCaseFiles: ['fileURI'],
          })
          .update();
        expect(wrapper).toMatchSnapshot();
      });
      it('should call the passed in onSubmit when all validations pass', () => {
        submitForm(wrapper);
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          exstingDocumentUrlsToAttach: ['fileURI'],
          printer: { printerId: 'ID' },
        });
      });
    });
  });
});
