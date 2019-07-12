import clone from 'ramda/src/clone';
import { connect } from 'react-redux';

import { getArrearsSummary } from '../../ducks/arrears';
import { getTasksSummary, invalidateSummaryTasks } from '../../ducks/tasks';
import getHelpers from '../../util/stateHelpers';
import { updateRibbon } from '../../ducks/ribbon';
import { showPatchSelect } from '../../ducks/patch';
import { sortPatchList, flattenPatches } from '../../util/patch';

export const mapStateToProps = state => {
  const { get, getBreadcrumbs, getString } = getHelpers(state);

  const profile = get(['user', 'profile']);

  return {
    arrears: get(['arrears', 'items']),
    tasks: get(['tasks', 'summaryItems']),
    breadcrumb: getBreadcrumbs(),
    cardLabels: getString(['arrearsSummaryCards']),
    filterLabel: get(['arrears', 'filterLabel']),
    tasksNoDataMsg: getString(['tasksNoDataMsg']),
    arrearsNoDataMsg: getString(['arrearsNoDataMsg']),
    taskCardLabels: getString(['taskSummaryCards']),
    heading: getString(['arrearsDashboard', 'heading']),
    loadingArrears: get(['arrears', 'loadingArrears']),
    loadingTasks: get(['tasks', 'loading']),
    patches: clone(sortPatchList(get(['patch', 'patchList']), profile)),
    profile,
    resultsCount: get(['arrears', 'resultsCount']),
    youText: getString(['patchSelect', 'you']),
  };
};

export const mergeProps = (
  { breadcrumb, heading, patches, ...stateProps },
  { dispatch },
  ownProps
) => ({
  ...stateProps,
  patches,
  getArrearsSummary: opts =>
    dispatch(getArrearsSummary({ patches: flattenPatches(patches), ...opts })),
  getTasksSummary: opts =>
    dispatch(
      getTasksSummary({
        patches: flattenPatches(patches),
        statuses: 'open',
        EntityType: 'Arrears',
        ...opts,
      })
    ),
  onOpenPatchSelect: () => dispatch(showPatchSelect()),
  invalidateTasks: () => dispatch(invalidateSummaryTasks()),
  updatePageHeader: () => dispatch(updateRibbon({ title: heading, breadcrumb })),
  ...ownProps,
});

export default connect(
  mapStateToProps,
  null,
  mergeProps
);
