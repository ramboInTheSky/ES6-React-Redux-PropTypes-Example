import { Loader, Typography } from 'nhh-styles';
import PropTypes from 'prop-types';
import React from 'react';

import { PreviewLinkContainer, PreviewLink, PreviewTemplate } from '../../components';
import { errorTextLabels, labelsPropTypes } from './types';
import forcePdfDownload from '../../util/forcePdfDownload';
import {
  PDF as ENCODING_TYPE_PDF,
  TEXT as ENCODING_TYPE_TEXT,
} from '../../constants/documentEncodingTypes';
import { HTML, TEXT } from '../../constants/previewTemplateTypes';
import { FailedFatal, FailedRetriable } from '../../constants/correspondenceErrorTypes';

class DraftCorrespondencePreviewDocuments extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  documentError = errorType => {
    let message = null;
    if (errorType === FailedFatal) {
      message = this.props.errorText.fatalError;
    } else if (errorType === FailedRetriable) {
      message = this.props.errorText.retriableError;
    }
    return message;
  };

  generationError = () => {
    let message = null;
    if (this.props.fatalError) {
      message = this.props.errorText.fatalError;
    } else if (this.props.retriableError) {
      message = this.props.errorText.retriableError;
    }
    return message;
  };

  handleDocumentPreview = ({ content, encodingType }) => {
    switch (encodingType) {
      case ENCODING_TYPE_PDF:
        forcePdfDownload(content);
        break;
      case ENCODING_TYPE_TEXT:
        {
          const template = (
            <PreviewTemplate
              content={content}
              dataBddPrefix={`draftCorrespondence-template`}
              onClose={this.props.closeTemplate}
              errorMessage={this.props.errorText.noTemplateFound}
              label={this.props.labels.closeTemplate}
              type={TEXT}
            />
          );
          this.props.openTemplate({ template, limitMaxWidth: true });
        }
        break;
      case HTML:
        {
          const template = (
            <PreviewTemplate
              content={content}
              dataBddPrefix={`draftCorrespondence-template`}
              onClose={this.props.closeTemplate}
              errorMessage={this.props.errorText.noTemplateFound}
              label={this.props.labels.closeTemplate}
              type={HTML}
            />
          );
          this.props.openTemplate({ template, limitMaxWidth: true });
        }
        break;
      default:
    }
  };

  render() {
    const {
      labels: { generatedCorrespondence, viewPreview, viewPreviewsBeforeProceeding },
    } = this.props;

    if (this.props.generatePreviewLoading) {
      return <Loader />;
    }

    return (
      <React.Fragment>
        {/* eslint-disable no-nested-ternary */}
        {this.props.documents.length ? (
          <React.Fragment>
            <Typography.Label>{generatedCorrespondence}</Typography.Label>
            <Typography.P>{viewPreviewsBeforeProceeding}</Typography.P>
            {this.props.documents.map(document => (
              <React.Fragment key={document.id}>
                {document.loading ? (
                  <Loader />
                ) : (
                  <React.Fragment>
                    <Typography.H5>
                      {document.recipientName} ({document.sendingMethod})
                    </Typography.H5>
                    <PreviewLinkContainer>
                      {document.errorType ? (
                        <Typography.Error>
                          {this.documentError(document.errorType)}
                        </Typography.Error>
                      ) : (
                        <PreviewLink
                          data-state-key={'previewLink'}
                          data-bdd={`${this.props.dataBddPrefix}-previewLink`}
                          onClick={() => this.handleDocumentPreview(document)}
                          isText
                        >
                          {viewPreview}
                        </PreviewLink>
                      )}
                    </PreviewLinkContainer>
                  </React.Fragment>
                )}
              </React.Fragment>
            ))}
          </React.Fragment>
        ) : this.generationError() ? (
          <Typography.Error>{this.generationError()}</Typography.Error>
        ) : null}
      </React.Fragment>
    );
  }
}

DraftCorrespondencePreviewDocuments.defaultProps = {
  documents: [],
  fatalError: false,
  generatePreviewLoading: false,
  retriableError: false,
};

DraftCorrespondencePreviewDocuments.propTypes = {
  closeTemplate: PropTypes.func.isRequired,
  dataBddPrefix: PropTypes.string.isRequired,
  errorText: errorTextLabels.isRequired,
  labels: labelsPropTypes.isRequired,
  openTemplate: PropTypes.func.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      content: PropTypes.string,
      encodingType: PropTypes.string,
      errorMessages: PropTypes.object,
      erroType: PropTypes.string,
      id: PropTypes.string,
      recipientName: PropTypes.string,
      sendingMethod: PropTypes.string,
      status: PropTypes.string,
      type: PropTypes.string,
    }).isRequired
  ),
  fatalError: PropTypes.bool,
  generatePreviewLoading: PropTypes.bool,
  retriableError: PropTypes.bool,
};

export default DraftCorrespondencePreviewDocuments;
