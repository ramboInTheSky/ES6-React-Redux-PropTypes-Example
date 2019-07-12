import devElse from '../util/devElse';
import {
  activitiesApi as activitiesApiBase,
  arrearsApi as arrearsApiBase,
  avatarsApi as avatarsApiBase,
  correspondenceApi as correspondenceApiBase,
  customerDashboard as customerDashboardBase,
  customersApi as customersApiBase,
  documentsApi as documentsApiBase,
  employeeDashboard as employeeDashboardBase,
  interactionsApi as interactionsApiBase,
  notesApi as notesApiBase,
  paymentsApi as paymentsApiBase,
  paymentsBaseURL as paymentsBase,
  tasksApi as tasksApiBase,
  sharepointApi as sharepointApiBase,
} from '../constants/tokens';

export const activitiesApi = devElse(
  'https://mynottinghill-dev.workwise.london/activities/web/api/v1',
  activitiesApiBase
);

export const arrearsApi = devElse(
  'https://mynottinghill-dev.workwise.london/arrears/web/api/v1',
  arrearsApiBase
);

export const avatarsApi = devElse(
  'https://nhhuksmedsamediad.blob.core.windows.net/employees/$id/Image/profile.jpg/profile_original.jpg',
  avatarsApiBase
);

export const correspondenceApi = devElse(
  'https://mynottinghill-dev.workwise.london/correspondence/web/api/v1/',
  correspondenceApiBase
);

export const customersApi = devElse(
  'https://mynottinghill-dev.workwise.london/customers/web/api/v1',
  customersApiBase
);

export const employeeDashboard = devElse(
  'https://mynottinghill-dev.workwise.london/dashboards/employees',
  employeeDashboardBase
);

export const customerDashboard = devElse(
  'https://mynottinghill-dev.workwise.london/dashboards/customers',
  customerDashboardBase
);

export const interactionsApi = devElse(
  'https://mynottinghill-dev.workwise.london/interactions/web/api/v1',
  interactionsApiBase
);

export const notesApi = devElse(
  'https://mynottinghill-dev.workwise.london/notes/web/api/v1',
  notesApiBase
);

export const payments = devElse(
  'https://mynottinghill-dev.workwise.london/payments/web',
  paymentsBase
);

export const paymentsApi = devElse(
  'https://mynottinghill-dev.workwise.london/payments/web/api/v1',
  paymentsApiBase
);

export const tasksApi = devElse(
  'https://mynottinghill-dev.workwise.london/tasks/web/api/v1',
  tasksApiBase
);

export const documentsApi = devElse(
  'https://mynottinghill-dev.workwise.london/documents/web/api/v1',
  documentsApiBase
);

export const sharepointApi = devElse(
  'https://mynottinghill-dev.workwise.london/documents/sharepoint',
  sharepointApiBase
);
