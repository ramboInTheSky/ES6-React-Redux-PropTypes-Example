import React, { Fragment } from 'react';
import format from 'string-format';
import { formatting } from 'nhh-styles';

import { installmentArrangement } from '../../util/paymentPlan';
import { Label } from './components';

export const getPauseDetails = (pause, labels, type) => {
  if (pause) {
    return (
      <Fragment>
        {format(labels.pauses[type === 'draft' ? 'draftPausePeriod' : 'pausePeriod'], {
          from: formatting.formatDate(pause.startDate),
          to: formatting.formatDate(pause.expiryDate),
        })}
        {type !== 'draft' && pause.isExtended ? (
          <Label>{` ${labels.pauses.isExtended}`}</Label>
        ) : null}
      </Fragment>
    );
  }
  return labels.none;
};

export const getPaymentPlanDetails = (plan, labels) => (
  <Fragment>
    <Label>{labels.paymentPlan.startDate}</Label> {formatting.formatDate(plan.startDate)}
    <br />
    <Label>{labels.paymentPlan.endDate}</Label> {formatting.formatDate(plan.endDate)}
    <br />
    <Label>{labels.paymentPlan.installment}</Label>{' '}
    {installmentArrangement(
      labels.installmentArrangementFormat,
      plan.installment.amount,
      plan.installment.period,
      formatting.formatDate(plan.startDate),
      plan.installment.schedule
    )}
    <br />
    <Label>{labels.paymentPlan.type}</Label> {plan.type}
  </Fragment>
);
