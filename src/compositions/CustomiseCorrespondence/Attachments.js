import React from 'react';
import PropTypes from 'prop-types';
import { AdvancedFileUpload, Table, Typography, Button, Pagination } from 'nhh-styles';
import { MediaTableView } from '../../components';
import { MandatoryField, TableWrapper, AttachmentsWrapper, ErrorText } from './components';
import AttachmentsTableFileName from '../../components/ShrinkableFileName';

class Attachments extends React.Component {
  state = {
    pageSize: 6,
  };

  componentDidMount() {
    this.props.getFilesByCaseId();
  }
  componentWillUnmount() {
    this.props.clearMediaState();
  }

  addCaseFile = fileUri => this.props.handleFilesChange([...this.props.selectedCaseFiles, fileUri]);

  removeCaseFile = fileUri =>
    this.props.handleFilesChange(this.props.selectedCaseFiles.filter(x => x !== fileUri));

  buildCaseFilesTable = () => {
    const { dictionary, mandatoryAttachments, downloadedFiles } = this.props;

    if (!mandatoryAttachments.length && !downloadedFiles.length) return null;

    const mandatoryFilesTableData = mandatoryAttachments.map(file => [
      <AttachmentsTableFileName name={file.friendlyName} />,
      <MandatoryField>{dictionary.mandatoryAttachment}</MandatoryField>,
    ]);

    const caseFilesTableData = downloadedFiles.map(file => {
      const isSelected = this.props.selectedCaseFiles.includes(file.uri);

      return [
        <AttachmentsTableFileName name={file.name} />,
        isSelected ? (
          <Button isText onClick={() => this.removeCaseFile(file.uri)}>
            {dictionary.removeCaseFile}
          </Button>
        ) : (
          <Button className={'success'} isText onClick={() => this.addCaseFile(file.uri)}>
            {dictionary.attachCaseFile}
          </Button>
        ),
      ];
    });

    const { pageSize } = this.state;

    return (
      <AttachmentsWrapper>
        <Typography.Label>{dictionary.mandatoryAttachmentLabel}</Typography.Label>
        <Typography.P>{dictionary.mandatoryAttachmentParagraph}</Typography.P>
        <TableWrapper>
          <Pagination
            initialPageSize={pageSize}
            items={mandatoryFilesTableData.concat(caseFilesTableData)}
            pageSize={6}
            render={items => {
              if (items.length !== pageSize) {
                this.setState({ pageSize: items.length });
              }

              return <Table addExtraTd={false} tdWrap data={items} />;
            }}
          />
        </TableWrapper>
      </AttachmentsWrapper>
    );
  };

  render() {
    if (!this.props.hasGeneratedCorrespondence) {
      return null;
    }

    const caseFilesTable = this.buildCaseFilesTable();

    const { onRetry, onRemove, onChange, pendingFiles, dictionary, hasDownloadError } = this.props;
    return (
      <React.Fragment>
        {caseFilesTable}
        {hasDownloadError && <ErrorText>{dictionary.genericErrorMessage}</ErrorText>}
        <AttachmentsWrapper>
          <AdvancedFileUpload
            {...dictionary}
            files={pendingFiles}
            onChange={onChange}
            onRemove={onRemove}
            onRetry={onRetry}
            maxFiles={10}
            accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt,.jpg,.png"
            maxFileSize={1024 * 1024 * 20}
            previewsRenderer={MediaTableView}
          />
        </AttachmentsWrapper>
      </React.Fragment>
    );
  }
}

Attachments.defaultProps = {
  dictionary: {},
  hasDownloadError: false,
};

Attachments.propTypes = {
  clearMediaState: PropTypes.func.isRequired,
  downloadedFiles: PropTypes.array.isRequired,
  getFilesByCaseId: PropTypes.func.isRequired,
  handleFilesChange: PropTypes.func.isRequired,
  hasGeneratedCorrespondence: PropTypes.bool.isRequired,
  mandatoryAttachments: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
  pendingFiles: PropTypes.arrayOf(
    PropTypes.shape({
      errorText: PropTypes.string,
      hasBeenUploaded: PropTypes.bool,
      hasUploadError: PropTypes.bool,
      id: PropTypes.string,
      isUploading: PropTypes.bool,
    })
  ).isRequired,
  selectedCaseFiles: PropTypes.arrayOf(PropTypes.string).isRequired,
  dictionary: PropTypes.shape({
    caseAttachmentLabel: PropTypes.string,
    caseAttachmentParagraph: PropTypes.string,
    genericErrorMessage: PropTypes.string,
    mandatoryAttachment: PropTypes.string,
    mandatoryAttachmentLabel: PropTypes.string,
    mandatoryAttachmentParagraph: PropTypes.string,
  }),
  hasDownloadError: PropTypes.bool,
};

export default Attachments;
