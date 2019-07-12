import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'nhh-styles';
import format from 'string-format';

import { Wrapper, H3 } from './components';
import { Note, NotePropType } from './';

export const NoteList = ({ notes, heading }) => (
  <Wrapper data-bdd="ActivityHistory">
    <H3>{format(heading, { count: notes.length })}</H3>
    <Pagination
      items={notes}
      pageSize={5}
      render={items => items.map(item => <Note {...item} key={item.id} />)}
    />
  </Wrapper>
);

NoteList.propTypes = {
  heading: PropTypes.string.isRequired,
  notes: PropTypes.arrayOf(PropTypes.shape(NotePropType)).isRequired,
};

export default NoteList;
