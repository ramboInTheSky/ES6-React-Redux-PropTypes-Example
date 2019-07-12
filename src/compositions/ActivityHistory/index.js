import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import format from 'string-format';
import { formatting, Pagination } from 'nhh-styles';

import { getActivityHistoryItemRoute } from '../../constants/internalRoutes';

import {
  Activity,
  ActivityBody,
  ActivityLabel,
  ActivityLink,
  H3,
  Wrapper,
  ActivityDescription,
} from './components';

import connect from './connect';

export class ActivityHistoryComposition extends PureComponent {
  componentDidMount() {
    this.props.getActivityHistory();
  }

  componentWillUnmount() {
    this.props.invalidateActivityHistory();
  }

  render() {
    const { activityHistory, arrearsId, heading, labels } = this.props;
    if (!activityHistory.length) return null;

    return (
      <Wrapper data-bdd="ActivityHistory">
        <H3>{format(heading, { count: activityHistory.length })}</H3>
        <Pagination
          items={activityHistory}
          pageSize={5}
          render={activities =>
            activities.map(({ createdBy, description, id, modifiedAt, type, originalType }, i) => (
              <Activity key={id + modifiedAt} data-bdd={`ActivityHistory-activity-item-${i}`}>
                <ActivityLink
                  data-bdd={`ActivityHistory-activity-${i}-title`}
                  to={getActivityHistoryItemRoute(arrearsId, id)}
                  isText
                >
                  {originalType || type}
                </ActivityLink>
                <ActivityBody>
                  <ActivityLabel>{labels.date}</ActivityLabel>{' '}
                  <span data-bdd={`ActivityHistory-activity-${i}-date`}>
                    {formatting.formatDate(modifiedAt, formatting.dateTimeFormat)}
                  </span>
                  <br />
                  <ActivityLabel>{labels.name}</ActivityLabel>{' '}
                  <span data-bdd={`ActivityHistory-activity-${i}-name`}>
                    {createdBy.displayName}
                  </span>
                  {description && (
                    <div>
                      <ActivityLabel>{labels.detail}</ActivityLabel>{' '}
                      <ActivityDescription data-bdd={`ActivityHistory-activity-${i}-detail`}>
                        {description}
                      </ActivityDescription>
                    </div>
                  )}
                </ActivityBody>
              </Activity>
            ))
          }
        />
      </Wrapper>
    );
  }
}

ActivityHistoryComposition.defaultProps = {
  activityHistory: [],
};

ActivityHistoryComposition.propTypes = {
  arrearsId: PropTypes.string.isRequired,
  getActivityHistory: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  invalidateActivityHistory: PropTypes.func.isRequired,
  labels: PropTypes.shape({
    date: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  activityHistory: PropTypes.arrayOf(
    PropTypes.shape({
      createdBy: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
      }).isRequired,
      id: PropTypes.string.isRequired,
      modifiedAt: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      description: PropTypes.string,
      originalType: PropTypes.string,
    })
  ),
};

export default withRouter(connect(ActivityHistoryComposition));
