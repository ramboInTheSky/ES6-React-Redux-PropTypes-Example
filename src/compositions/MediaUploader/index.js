import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AdvancedFileUpload } from 'nhh-styles';
import { MediaTableView, FormWrapper } from '../../components';
import { PageContent } from '../';

import { Wrapper } from './components';

import connect from './connect';

export class MediaUploader extends Component {
  componentDidMount() {
    this.props.updatePageHeader();
  }

  componentWillUnmount() {
    this.props.clearMediaState();
  }

  render() {
    const { hasFileUploadErrors, dictionary, pendingFiles, ...props } = this.props;

    return (
      <PageContent>
        <div className="col-lg-12">
          <FormWrapper
            hidePropertyInformation
            formName="mediaUploader"
            formError={hasFileUploadErrors ? dictionary.errorText : null}
            handleFormSubmit={this.props.onSubmit}
            submitButtonText={dictionary.submitLabel}
            disableSubmit={hasFileUploadErrors}
          >
            <p>
              {dictionary.paragraphAttach}
              <br />
              {dictionary.paragraphContinue}
            </p>
            <Wrapper>
              <AdvancedFileUpload
                {...dictionary}
                {...props}
                files={pendingFiles}
                maxFiles={this.props.maxFiles}
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.jpg,.png"
                maxFileSize={1024 * 1024 * 20}
                multiple={this.props.multiple}
                previewsRenderer={MediaTableView}
              />
            </Wrapper>
          </FormWrapper>
        </div>
      </PageContent>
    );
  }
}

MediaUploader.defaultProps = {
  hasFileUploadErrors: false,
};

MediaUploader.propTypes = {
  clearMediaState: PropTypes.func.isRequired,
  dictionary: PropTypes.shape({
    errorText: PropTypes.string,
    labelText: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  maxFiles: PropTypes.number.isRequired,
  multiple: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pendingFiles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ).isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  hasFileUploadErrors: PropTypes.bool,
};

export default connect(MediaUploader);
