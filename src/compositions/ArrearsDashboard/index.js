import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ActivePatchList, Loader } from 'nhh-styles';

import ArrearsSummaryCards, {
  cardPropTypes,
  cardLabelPropTypes,
} from '../../components/ArrearsSummaryCards';

import TasksSummaryCards, {
  taskCardPropTypes,
  taskCardLabelPropTypes,
} from '../../components/TasksSummaryCards';

import ArrearsFilters from '../../compositions/ArrearsDashboardFilters';

import { ErrorBoundary as EB } from '../../components';

import { PageContent, PatchStatistics } from '../';
import { PatchesWrapper } from './components';
import connect from './connect';

import { TASKS_SEL } from '../../constants/dropdownValues';

export class ArrearsDashboardComposition extends PureComponent {
  state = {
    statusFilterId: TASKS_SEL,
  };

  componentDidMount() {
    this.props.getTasksSummary();
    this.props.updatePageHeader();
  }

  componentWillUnmount() {
    this.props.invalidateTasks();
  }

  handleChangeFilter = value => this.setState({ statusFilterId: value });

  render() {
    const {
      arrears,
      arrearsNoDataMsg,
      cardLabels,
      filterLabel,
      getArrearsSummary,
      loadingArrears,
      loadingTasks,
      onOpenPatchSelect,
      patches,
      profile,
      resultsCount,
      tasks,
      taskCardLabels,
      tasksNoDataMsg,
      youText,
    } = this.props;

    const sharedCardProps = {
      userId: profile.id,
      youText,
    };

    const showTasksOrArrears = () => {
      const { statusFilterId } = this.state;
      // next line exists because of a requirement to show arrearsNoDataMsg on the Task view (being tasks hierarchically dependants on Arrears)
      const isEitherTasksOrArrearsLoading = loadingArrears && loadingTasks;
      return isEitherTasksOrArrearsLoading ? (
        <Loader />
      ) : (
        <EB>
          {statusFilterId === TASKS_SEL ? (
            <TasksSummaryCards
              tasks={tasks}
              cardLabels={taskCardLabels}
              loading={loadingTasks}
              noDataMsg={arrears.length ? tasksNoDataMsg : arrearsNoDataMsg}
              {...sharedCardProps}
            />
          ) : (
            <ArrearsSummaryCards
              arrears={arrears}
              cardLabels={cardLabels}
              filterLabel={filterLabel}
              getArrearsSummary={getArrearsSummary}
              loading={loadingArrears}
              noDataMsg={arrearsNoDataMsg}
              resultsCount={resultsCount}
              {...sharedCardProps}
            />
          )}
        </EB>
      );
    };

    return (
      <PageContent>
        <div className="col-lg-9">
          <ArrearsFilters onChange={this.handleChangeFilter} />
        </div>
        <div className="col-lg-9">{showTasksOrArrears()}</div>
        <aside className="col-lg-3">
          <EB>
            <PatchesWrapper>
              <ActivePatchList
                openPatchSelect={onOpenPatchSelect}
                patches={patches.map(p => {
                  const isYou = profile.patchName === p.patchName;
                  const name = isYou ? youText : p.name;
                  return {
                    ...p,
                    name,
                    fullname: name,
                    customName: isYou,
                  };
                })}
              />
            </PatchesWrapper>
          </EB>
          <PatchStatistics />
        </aside>
      </PageContent>
    );
  }
}

ArrearsDashboardComposition.defaultProps = {
  arrears: null,
  filterLabel: 'ArrearsCardsPagination',
  patches: [],
  resultsCount: 0,
  tasks: null,
  youText: '',
};

ArrearsDashboardComposition.propTypes = {
  arrearsNoDataMsg: PropTypes.string.isRequired,
  cardLabels: PropTypes.shape(cardLabelPropTypes).isRequired,
  getArrearsSummary: PropTypes.func.isRequired,
  getTasksSummary: PropTypes.func.isRequired,
  invalidateTasks: PropTypes.func.isRequired,
  loadingArrears: PropTypes.bool.isRequired,
  loadingTasks: PropTypes.bool.isRequired,
  onOpenPatchSelect: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.string.isRequired,
    patchName: PropTypes.string,
  }).isRequired,
  taskCardLabels: PropTypes.shape(taskCardLabelPropTypes).isRequired,
  tasksNoDataMsg: PropTypes.string.isRequired,
  updatePageHeader: PropTypes.func.isRequired,
  arrears: PropTypes.arrayOf(PropTypes.shape(cardPropTypes).isRequired),
  filterLabel: PropTypes.string,
  patches: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      patchName: PropTypes.string,
    }).isRequired
  ),
  resultsCount: PropTypes.number,
  tasks: PropTypes.arrayOf(PropTypes.shape(taskCardPropTypes).isRequired),
  youText: PropTypes.string,
};

export default connect(ArrearsDashboardComposition);
