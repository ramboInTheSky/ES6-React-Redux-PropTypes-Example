import { connect } from 'react-redux';

import {
  getStatuses as getArrearStatuses,
  updateFiltersAndFetchResults,
} from '../../ducks/arrears';
import { getTasksSummary, getStatuses as getTaskStatuses } from '../../ducks/tasks';
import getHelpers from '../../util/stateHelpers';
import { sortPatchList, flattenPatches } from '../../util/patch';

export const mapStateToProps = state => {
  const { get, getString } = getHelpers(state);

  const profile = get(['user', 'profile']);

  return {
    taskStatuses: get(['tasks', 'statuses']),
    arrearStatuses: get(['arrears', 'statuses']),
    arrearsDashboardLabels: getString(['arrearsDashboard']),
    filterLabels: get(['dictionary', 'arrearsDashboard', 'filters']),
    heading: getString(['arrearsDashboard', 'heading']),
    loadingArrears: get(['arrears', 'loadingArrears']),
    loadingTasks: get(['tasks', 'loading']),
    patches: sortPatchList(get(['patch', 'patchList']), profile),
    profile,
    youText: get(['patchList', 'you']),
  };
};

export const mergeProps = (
  { breadcrumb, heading, patches, ...stateProps },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  patches,
  getArrearsSummary: (opts, item) =>
    dispatch(updateFiltersAndFetchResults({ patches: flattenPatches(patches), ...opts }, item)),
  getArrearStatuses: opts =>
    dispatch(getArrearStatuses({ patches: flattenPatches(patches), ...opts })),
  getTaskStatuses: opts =>
    dispatch(getTaskStatuses({ patches: flattenPatches(patches), EntityType: 'Arrears', ...opts })),
  getTasksSummary: opts =>
    dispatch(
      getTasksSummary({
        patches: flattenPatches(patches),
        statuses: 'open',
        EntityType: 'Arrears',
        ...opts,
      })
    ),
  ...ownProps,
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
);
