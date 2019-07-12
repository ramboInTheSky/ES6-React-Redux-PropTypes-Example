import path from 'ramda/src/path';
import Dictionary from '../constants/dictionary';

export const LOCAL = 'local';
export const MAILING_HOUSE = 'mailing-house';

const dictionary = Dictionary();

export default [
  {
    id: MAILING_HOUSE,
    name: path(['correspondence', 'labels', 'printViaMailingHouse'], dictionary),
  },
  { id: LOCAL, name: path(['correspondence', 'labels', 'printLocally'], dictionary) },
];
