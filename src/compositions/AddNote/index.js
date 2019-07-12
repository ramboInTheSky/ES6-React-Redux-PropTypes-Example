import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AddNoteForm, NotificationPanel, Typography, Checkbox, Loader } from 'nhh-styles';

import { PageContent, PropertyInformation } from '../';

import { NotificationWrapper } from '../../components';

import { CustomerDetailsContainer, FormContainer, Link, Wrapper } from './components';
import connect from './connect';

export class AddNoteComposition extends PureComponent {
  state = {
    wantsToAttachFiles: false,
  };

  componentDidMount() {
    const { updatePageHeader } = this.props;
    updatePageHeader();
  }

  componentWillUnmount() {
    const { clearError } = this.props;
    clearError();
  }

  onSubmit = note => {
    const { wantsToAttachFiles } = this.state;
    this.props.onSubmit(note, wantsToAttachFiles);
  };

  onAttachFiles = () =>
    this.setState({
      wantsToAttachFiles: !this.state.wantsToAttachFiles,
    });

  render() {
    const {
      addInteraction,
      addNote,
      arrearsId,
      attachFile,
      back,
      error,
      formError,
      note,
      noteError,
      onBack,
      warning,
      isLoading,
    } = this.props;

    const { wantsToAttachFiles } = this.state;

    const attachFiles = (
      <Checkbox
        data-bdd="addNoteForm-attachFiles"
        data-state-key={'attachFiles'}
        onChange={this.onAttachFiles}
        checked={wantsToAttachFiles}
      >
        {attachFile}
      </Checkbox>
    );

    if (isLoading) {
      return <Loader />;
    }

    return (
      <PageContent>
        <div className="col-lg-9">
          <Wrapper>
            <CustomerDetailsContainer>
              <PropertyInformation />
            </CustomerDetailsContainer>
            <FormContainer>
              <Typography.P>
                {warning}
                &nbsp;<Link
                  data-bdd="AddInteraction-link"
                  to={`/arrears-details/${arrearsId}/interaction/create`}
                  isText
                >
                  {addInteraction}
                </Link>
              </Typography.P>

              {!!error && (
                <NotificationWrapper data-bdd="AddNote-error">
                  <NotificationPanel icon="warning" description={formError} hideCloseButton show />
                </NotificationWrapper>
              )}

              <AddNoteForm
                noteError={noteError}
                noteLabel={note}
                onSubmit={this.onSubmit}
                submitText={addNote}
                cancelText={back}
                fileAttachmentLabel={attachFile}
                onCancel={onBack}
                additionalFields={attachFiles}
              />
            </FormContainer>
          </Wrapper>
        </div>
      </PageContent>
    );
  }
}

AddNoteComposition.defaultProps = {
  error: false,
};

AddNoteComposition.propTypes = {
  addInteraction: PropTypes.string.isRequired,
  addNote: PropTypes.string.isRequired,
  arrearsId: PropTypes.string.isRequired,
  attachFile: PropTypes.string.isRequired,
  back: PropTypes.string.isRequired,
  clearError: PropTypes.func.isRequired,
  formError: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  note: PropTypes.string.isRequired,
  noteError: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  warning: PropTypes.string.isRequired,
  error: PropTypes.bool,
};

export default connect(AddNoteComposition);
