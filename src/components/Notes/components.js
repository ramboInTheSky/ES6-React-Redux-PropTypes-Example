import styled from 'styled-components';
import { Typography } from 'nhh-styles';

export const NoteItem = styled.div`
  margin-bottom: 1rem;
`;

export const NoteDate = styled.span`
  font-weight: bold;
`;

export const NoteAuthor = styled.span`
  font-weight: bold;
  padding-right: 1rem;
`;

export const NoteSubject = styled.span``;

export const NoteBody = styled.div`
  word-break: break-all;
`;

export const Wrapper = styled.div`
  clear: both;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
`;

export const H3 = styled(Typography.H3)`
  margin-bottom: 30px;
`;
