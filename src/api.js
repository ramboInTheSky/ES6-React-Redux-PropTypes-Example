import {
  ActivitiesApi,
  ArrearsApi,
  CorrespondenceApi,
  CustomerApi,
  DocumentsApi,
  InteractionsApi,
  NotesApi,
  PaymentsApi,
  TasksApi,
} from 'nhh-styles';
import {
  activitiesApi as activitiesApiBase,
  arrearsApi as arrearsApiBase,
  correspondenceApi as correspondenceApiBase,
  customersApi as customersApiBase,
  documentsApi as documentsBaseApi,
  interactionsApi as interactionsApiBase,
  notesApi as notesApiBase,
  paymentsApi as paymentsApiBase,
  sharepointApi as sharepointApiBase,
  tasksApi as tasksApiBase,
} from './constants/routes';

export const activitiesApi = new ActivitiesApi({ baseURL: activitiesApiBase });
export const arrearsApi = new ArrearsApi({ baseURL: arrearsApiBase });
export const correspondenceApi = new CorrespondenceApi({ baseURL: correspondenceApiBase });
export const customerApi = new CustomerApi({ baseURL: customersApiBase });
export const documentsApi = new DocumentsApi({ baseURL: documentsBaseApi });
export const interactionsApi = new InteractionsApi({ baseURL: interactionsApiBase });
export const notesApi = new NotesApi({ baseURL: notesApiBase });
export const paymentsApi = new PaymentsApi({ baseURL: paymentsApiBase });
export const tasksApi = new TasksApi({ baseURL: tasksApiBase });
export const sharepointApi = new DocumentsApi({ baseURL: sharepointApiBase, responseType: 'blob' });
