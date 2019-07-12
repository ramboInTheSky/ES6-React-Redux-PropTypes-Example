import React from 'react';
import PropTypes from 'prop-types';
import { formatting } from 'nhh-styles';

import { NoteItem, NoteBody, NoteSubject, NoteDate, NoteAuthor } from './components';

export const NotePropType = {
  created: PropTypes.shape({
    on: PropTypes.string.isRequired,
    by: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  subject: PropTypes.string,
  text: PropTypes.string,
};

export const Note = ({ id, created, text, subject }) => (
  <NoteItem key={id} data-bdd={`note-item-${id}`}>
    <NoteBody>
      <NoteDate data-bdd={`note-${id}-date`}>
        {formatting.formatDate(created.on, formatting.dateTimeFormat)}
      </NoteDate>
      {created.by ? (
        <NoteAuthor data-bdd={`note-${id}-name`}>
          {' - '}
          {created.by}
        </NoteAuthor>
      ) : null}
      {subject ? <NoteSubject data-bdd={`note-${id}-subject`}>{subject}</NoteSubject> : null}
      {text && (
        <div>
          <span data-bdd={`note-${id}-text`}>{text}</span>
        </div>
      )}
    </NoteBody>
  </NoteItem>
);

Note.propTypes = NotePropType;

Note.defaultProps = {
  subject: '',
  text: '',
};
