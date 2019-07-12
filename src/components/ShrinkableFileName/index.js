import React from 'react';
import PropTypes from 'prop-types';
import { shortenFileName } from '../../util/splitAndWrap';
import { LabelWrapper } from './components';

const shorterNameForDesktop = shortenFileName(26);
const shorterNameForMobile = shortenFileName(7);

const AttachmentsTableFileName = ({ name }) => (
  <LabelWrapper>
    <span className="d-none d-lg-block">{shorterNameForDesktop(name)}</span>
    <span className="d-lg-none">{shorterNameForMobile(name)}</span>
  </LabelWrapper>
);

AttachmentsTableFileName.propTypes = {
  name: PropTypes.string.isRequired,
};

export default AttachmentsTableFileName;
