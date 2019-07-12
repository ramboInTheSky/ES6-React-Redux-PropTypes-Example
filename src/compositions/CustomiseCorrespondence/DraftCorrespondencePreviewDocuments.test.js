import { Loader } from 'nhh-styles';
import path from 'ramda/src/path';
import React from 'react';
import { shallow } from 'enzyme';
import Dictionary from '../../constants/dictionary';
import DraftCorrespondencePreviewDocuments from './DraftCorrespondencePreviewDocuments';
import forcePdfDownload from '../../util/forcePdfDownload';
import { FailedFatal, FailedRetriable } from '../../constants/correspondenceErrorTypes';
import { HTML, TEXT } from '../../constants/documentEncodingTypes';

jest.mock('../../util/forcePdfDownload');

const dictionary = Dictionary();

function sel(id) {
  return `[data-state-key="${id}"]`;
}

const defaultProps = {
  closeTemplate: () => {},
  dataBddPrefix: '',
  documents: [
    {
      content: 'JVBERi0xLjUNCjQgMCBvYmoNCjw8L1R5cGUgL1BhZ2UvUGFyZW',
      encodingType: 'Pdf',
      errorMessages: { failures: null },
      erroType: null,
      id: 'asdasd213123',
      loading: false,
      recipientName: 'recipient name',
      sendingMethod: 'Post',
      status: 'Success',
      type: 'Letter',
    },
  ],
  errorText: path(['correspondence', 'errorText'], dictionary),
  labels: path(['correspondence', 'labels'], dictionary),
  openTemplate: () => {},
};

const render = props =>
  shallow(<DraftCorrespondencePreviewDocuments {...defaultProps} {...props} />);

describe('<DraftCorrespondencePreviewDocuments />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the page with the default props', () => {
    const el = render();
    expect(el).toMatchSnapshot();
  });

  it('should show a Loader when generatePreviewLoading is passed in', () => {
    const el = render({ generatePreviewLoading: true });
    expect(el).toMatchSnapshot();
  });

  it('should show a fatal error if there are no docments and there is a fatal error', () => {
    const el = render({ documents: [], fatalError: true });
    expect(el).toMatchSnapshot();
  });

  it('should show a retriable error if there are no docments and there is a retriable error', () => {
    const el = render({ documents: [], retriableError: true });
    expect(el).toMatchSnapshot();
  });

  it('should be empty if documents length is 0 and no errors', () => {
    const el = render({ documents: [] });
    expect(el.children().length).toBe(0);
  });

  it('should render a loader for the documents with the loading flag', () => {
    const el = render({ documents: [{ ...defaultProps.documents[0], loading: true }] });
    expect(el.find(Loader).exists()).toBe(true);
  });

  it('should render a fatal document error for the particular document if errorType is set to FailedFatal', () => {
    const el = render({
      documents: [{ ...defaultProps.documents[0], errorType: FailedFatal, loading: true }],
    });
    expect(el).toMatchSnapshot();
  });

  it('should render a retriable document error for the particular document if errorType is set to FailedRetriable', () => {
    const el = render({
      documents: [{ ...defaultProps.documents[0], errorType: FailedRetriable, loading: true }],
    });
    expect(el).toMatchSnapshot();
  });

  it('should call forcePdfDownload with the correct content when document encoding type is pdf', () => {
    const pdfContent = 'pdf';
    const el = render({ documents: [{ ...defaultProps.documents[0], content: pdfContent }] });
    el.find(sel('previewLink'))
      .props()
      .onClick();
    expect(forcePdfDownload).toHaveBeenCalledWith(pdfContent);
  });

  it('should open the <PreviewTemplate /> with the relevant props when document encoding type is Html', () => {
    const htmlContent = '<p>html content</p>';
    const openTemplate = jest.fn();
    const el = render({
      documents: [{ ...defaultProps.documents[0], encodingType: HTML, content: htmlContent }],
      openTemplate,
    });
    el.find(sel('previewLink'))
      .props()
      .onClick();
    expect(openTemplate).toHaveBeenCalled();
    expect(openTemplate.mock.calls[0][0]).toMatchSnapshot();
  });

  it('should open the <PreviewTemplate /> with the relevant props when document encoding type is Text', () => {
    const textContent = 'asdsad asd';
    const openTemplate = jest.fn();
    const el = render({
      documents: [{ ...defaultProps.documents[0], encodingType: TEXT, content: textContent }],
      openTemplate,
    });
    el.find(sel('previewLink'))
      .props()
      .onClick();
    expect(openTemplate).toHaveBeenCalled();
    expect(openTemplate.mock.calls[0][0]).toMatchSnapshot();
  });
});
