import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { formatting, Pagination, Button, Loader } from 'nhh-styles';
import { withTheme } from 'styled-components';
import format from 'string-format';
import isAfter from 'date-fns/is_after';
import compose from 'ramda/src/compose';
import {
  Task,
  TaskBody,
  TaskDescription,
  TaskLabel,
  Label,
  TaskValue,
  TaskLink,
  H3,
  Wrapper,
  OverdueLabel,
  ButtonsWrapper,
} from './components';
import {
  getTaskActivityRouteByActionType,
  getArchivedTasksRoute,
} from '../../constants/internalRoutes';
import { CANCELLED } from '../../constants/taskStatuses';

import connect from './connect';
import TaskCancelModal from '../TaskCancelModal';
import TaskCloseModal from '../TaskCloseModal';
import TaskReassignModal from '../TaskReassignModal';

// this function is extracted here so it can be unit tested
const renderTasks = ({
  arrearsId,
  labels,
  openTaskModal,
  canCreateLegalReferral,
  archived,
  archivedTasksLabels,
  legalReferralActionStatus,
  legalReferralId,
}) => {
  const Comp = ({ items }) => (
    <React.Fragment>
      {items.map((task, i) => {
        const {
          dueDate,
          owner,
          description,
          id,
          createdOn,
          raisedBy,
          status,
          title,
          type,
          actionType,
          completedDate,
          reason,
        } = task;

        const taskDueDate = dueDate ? formatting.formatDate(dueDate) : null;
        const taskIsOverdue = !archived && (taskDueDate ? isAfter(new Date(), dueDate) : false);
        const showLink =
          !archived &&
          type === 'system' &&
          actionType &&
          ((actionType === 'legalreferral' && canCreateLegalReferral) ||
            (actionType !== 'legalreferral' && !canCreateLegalReferral));

        const isReviewLegalReferral = legalReferralActionStatus !== '';

        const taskStatusLabelKey = status === CANCELLED ? 'cancelled' : 'completed';

        return (
          <Task key={id + createdOn} data-bdd={`tasks-task-item-${i}`} overdue={taskIsOverdue}>
            {showLink ? (
              <TaskLink
                data-bdd={`tasks-task-${i}-title`}
                to={getTaskActivityRouteByActionType(
                  actionType,
                  arrearsId,
                  isReviewLegalReferral ? legalReferralId : null
                )}
                isText
              >
                {title}
              </TaskLink>
            ) : (
              <Label data-bdd={`tasks-task-${i}-title`}>{title}</Label>
            )}
            <TaskBody>
              {archived && (
                <React.Fragment>
                  <TaskLabel>
                    {archivedTasksLabels[taskStatusLabelKey]}
                    {': '}
                  </TaskLabel>
                  <span data-bdd={`tasks-task-${i}-${taskStatusLabelKey}`}>
                    {formatting.formatDate(completedDate, formatting.dateTimeFormat)}
                  </span>
                  <br />
                </React.Fragment>
              )}
              <TaskLabel overdue={taskIsOverdue}>
                {type === 'system' ? labels.dueDate : labels.doDate}
                {': '}
              </TaskLabel>
              <TaskValue overdue={taskIsOverdue} data-bdd={`tasks-task-${i}-date`}>
                {dueDate ? formatting.formatDate(dueDate, formatting.dateTimeFormat) : 'N/A'}
                {taskIsOverdue ? <OverdueLabel> {labels.overdue}</OverdueLabel> : null}
              </TaskValue>
              <br />
              <TaskLabel>
                {labels.owner}
                {': '}
              </TaskLabel>
              <span data-bdd={`tasks-task-${i}-name`}>{owner.name}</span>
              <br />
              <TaskLabel>
                {labels.created}
                {': '}
              </TaskLabel>
              <span data-bdd={`tasks-task-${i}-createdOn`}>
                {formatting.formatDate(createdOn, formatting.dateTimeFormat)}
                {', '}
                {raisedBy && raisedBy.name}
              </span>
              <br />
              {archived &&
                reason && (
                  <React.Fragment>
                    <TaskLabel>
                      {archivedTasksLabels.reasons}
                      {': '}
                    </TaskLabel>
                    <span data-bdd={`tasks-task-${i}-reason`}>{reason}</span>
                    <br />
                  </React.Fragment>
                )}
              {description && (
                <TaskDescription data-bdd={`tasks-task-${i}-detail`}>{description}</TaskDescription>
              )}
            </TaskBody>
            {!archived ? (
              <ButtonsWrapper>
                <Button
                  buttonType="secondary"
                  data-bdd={'TaskItem-cancel'}
                  onClick={() =>
                    openTaskModal(<TaskCancelModal arrearsId={arrearsId} task={task} />)
                  }
                  type="button"
                >
                  {labels.taskCancelButton}
                </Button>
                <Button
                  buttonType="secondary"
                  data-bdd={'TaskItem-reassign'}
                  onClick={() =>
                    openTaskModal(<TaskReassignModal arrearsId={arrearsId} task={task} />)
                  }
                  type="button"
                >
                  {labels.taskReassignButton}
                </Button>
                <Button
                  buttonType="primary"
                  data-bdd={'TaskItem-complete'}
                  type="button"
                  onClick={() =>
                    openTaskModal(<TaskCloseModal arrearsId={arrearsId} task={task} />)
                  }
                >
                  {labels.taskCompleteButton}
                </Button>
              </ButtonsWrapper>
            ) : null}
          </Task>
        );
      })}
      {!archived && (
        <TaskLink to={getArchivedTasksRoute(arrearsId)} isText>
          {labels.viewOtherTasks}
        </TaskLink>
      )}
    </React.Fragment>
  );

  Comp.propTypes = {
    items: PropTypes.array.isRequired,
  };

  return Comp;
};

export class ArrearsDetailTasksComposition extends PureComponent {
  componentDidMount() {
    this.props.getArrearTasks(this.props.archived);
  }

  componentWillUnmount() {
    this.props.invalidateTasks();
  }

  render() {
    const {
      archived,
      archivedTasksLabels,
      arrearsId,
      tasks,
      heading,
      labels,
      openTaskModal,
      isLoading,
      canCreateLegalReferral,
      legalReferralActionStatus,
      legalReferralId,
    } = this.props;
    if (isLoading) return <Loader />;
    return (
      <Wrapper data-bdd="Tasks">
        <H3>{format(archived ? archivedTasksLabels.heading : heading, { count: tasks.length })}</H3>
        <Pagination
          items={tasks}
          pageSize={archived ? 6 : 3}
          render={items =>
            renderTasks({
              arrearsId,
              labels,
              openTaskModal,
              canCreateLegalReferral,
              archived,
              archivedTasksLabels,
              legalReferralActionStatus,
              legalReferralId,
            })({
              items,
            })
          }
        />
      </Wrapper>
    );
  }
}

ArrearsDetailTasksComposition.defaultProps = {
  isLoading: false,
  tasks: [],
  archived: false,
  canCreateLegalReferral: false,
  legalReferralActionStatus: '',
  legalReferralId: undefined,
};

ArrearsDetailTasksComposition.propTypes = {
  archivedTasksLabels: PropTypes.shape({
    completed: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    reasons: PropTypes.string.isRequired,
  }).isRequired,
  arrearsId: PropTypes.string.isRequired,
  getArrearTasks: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  invalidateTasks: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    doDate: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    overdue: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    taskCancelButton: PropTypes.string.isRequired,
    taskCompleteButton: PropTypes.string.isRequired,
    taskReassignButton: PropTypes.string.isRequired,
    viewOtherTasks: PropTypes.string.isRequired,
  }).isRequired,
  openTaskModal: PropTypes.func.isRequired,
  archived: PropTypes.bool,
  canCreateLegalReferral: PropTypes.bool,
  isLoading: PropTypes.bool,
  legalReferralActionStatus: PropTypes.string,
  legalReferralId: PropTypes.string,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      createdOn: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      owner: PropTypes.object.isRequired,
      raisedBy: PropTypes.shape({
        name: PropTypes.string.isRequired,
        dueDate: PropTypes.string,
      }).isRequired,
      regardingObjectModel: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
      }).isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      actionType: PropTypes.string,
      completedDate: PropTypes.string,
      description: PropTypes.string,
      reason: PropTypes.string,
    })
  ),
};

const composed = compose(
  withTheme,
  withRouter,
  connect
);

export default composed(ArrearsDetailTasksComposition);

export { renderTasks };
