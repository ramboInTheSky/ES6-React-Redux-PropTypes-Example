import styled from 'styled-components';
import { Button, Typography, mediaQueries } from 'nhh-styles';

export const Heading = styled(Typography.H3)`
  margin-bottom: 1.5rem;
`;

export const Label = styled.span`
  font-weight: 700;
  ${mediaQueries.desktop`
    white-space: nowrap;
  `};
  ${mediaQueries.tablet`
    white-space: nowrap;
  `};
`;

export const LabelLink = styled(Button)`
  font-weight: 700;
  font-size: 18px;
  padding: 0;
  text-align: left;
`;

export const Wrapper = styled.div`
  margin-bottom: 1.5rem;
`;
