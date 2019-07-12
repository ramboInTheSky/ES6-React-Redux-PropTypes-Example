import compose from 'ramda/src/compose';
import join from 'ramda/src/join';
import map from 'ramda/src/map';
import filter from 'ramda/src/filter';
import prop from 'ramda/src/prop';
import { avatarsApi } from '../constants/routes';

const getAvatarSrc = id => avatarsApi.replace('$id', id);

// eslint-disable-next-line import/prefer-default-export
export const getPatchInfo = ({ fullname, id, patchName }) => ({
  fullname,
  name: fullname,
  patchName,
  src: getAvatarSrc(id),
});

export const sortPatchList = (patches, profile) =>
  patches.sort((p1, p2) => {
    const isSamePatchName1 = p1.patchName === profile.patchName;
    const isSamePatchName2 = p2.patchName === profile.patchName;
    const secondSorting = isSamePatchName2 ? 1 : 0;
    return isSamePatchName1 ? -1 : secondSorting;
  });

export const flattenPatches = compose(
  join(','),
  map(prop('patchName')),
  filter(prop('patchName'))
);
