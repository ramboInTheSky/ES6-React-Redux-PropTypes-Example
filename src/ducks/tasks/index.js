import { tasksApi } from '../../api';
import objectWithoutNullProperties from '../../util/objectWithoutNullProperties';
// Actions
export const CLEAR_TASK_ACTION_ERROR = 'tasks/CLEAR_TASK_ACTION_ERROR';
export const GETTING_TASKS = 'tasks/GETTING_TASKS';
export const SET_TASKS = 'tasks/SET_TASKS';
export const SET_SUMMARY_TASKS = 'tasks/SET_SUMMARY_TASKS';
export const ADDING_TASK = 'tasks/ADDING_TASK';
export const CLEAR_TASK_ERROR = 'tasks/CLEAR_TASK_ERROR';
export const TASK_ACTION_ERROR = 'tasks/TASK_ACTION_ERROR';
export const TASK_ACTION_SUCCESS = 'tasks/TASK_ACTION_SUCCESS';
export const TASK_ADDED = 'tasks/TASK_ADDED';
export const TASK_ERROR = 'tasks/TASK_ERROR';
export const SET_STATUSES = 'tasks/SET_STATUSES';

const initialState = {
  statuses: {},
  summaryItems: [],
  items: [],
  loading: false,
  modalActionError: false,
  error: false,
};

const {
  getStatuses: getTasksStatuses,
  getTasks: getTasksApi,
  getTasksSummary: getTasksSummaryApi,
  patchTaskStatus,
  patchTaskOwner,
} = tasksApi;

// Reducers
export default function reducer(state = initialState, { type, isFormError, payload }) {
  switch (type) {
    case CLEAR_TASK_ACTION_ERROR: {
      return {
        ...state,
        modalActionError: false,
        loading: false,
      };
    }
    case GETTING_TASKS: {
      return {
        ...state,
        loading: true,
      };
    }

    case SET_SUMMARY_TASKS: {
      return {
        ...state,
        summaryItems: payload,
        loading: false,
      };
    }

    case SET_TASKS: {
      return {
        ...state,
        items: payload,
        loading: false,
      };
    }

    case SET_STATUSES: {
      const statusesObject = payload.reduce((acc, curr) => {
        acc[curr.type] = acc[curr.type] || {};
        acc[curr.type][curr.status] = { count: curr.count };
        return acc;
      }, {});

      return {
        ...state,
        statuses: statusesObject,
      };
    }

    case ADDING_TASK: {
      return {
        ...state,
        error: false,
        loading: true,
      };
    }

    case CLEAR_TASK_ERROR: {
      return {
        ...state,
        error: false,
        loading: false,
      };
    }

    case TASK_ACTION_ERROR: {
      return {
        ...state,
        modalActionError: true,
        loading: false,
      };
    }

    case TASK_ACTION_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }

    case TASK_ADDED: {
      return {
        ...state,
        error: false,
        loading: false,
      };
    }

    case TASK_ERROR: {
      return {
        ...state,
        error: true,
        loading: false,
        isFormError,
      };
    }

    default:
      return state;
  }
}

// Dispatches
export const addingTask = () => ({
  type: ADDING_TASK,
});

export const clearActionErrors = () => ({
  type: CLEAR_TASK_ACTION_ERROR,
});

export const clearTaskError = () => ({
  type: CLEAR_TASK_ERROR,
});

export const loading = () => ({ type: GETTING_TASKS });

export const setStatuses = payload => ({
  type: SET_STATUSES,
  payload,
});

export const setSummaryTasks = payload => ({
  type: SET_SUMMARY_TASKS,
  payload,
});

export const setTasks = payload => ({
  type: SET_TASKS,
  payload,
});

export const taskAdded = () => ({
  type: TASK_ADDED,
});

export const taskActionError = () => ({
  type: TASK_ACTION_ERROR,
});

export const taskActionSuccess = payload => ({
  type: TASK_ACTION_SUCCESS,
  payload,
});

export const taskError = (isFormError = false) => ({
  type: TASK_ERROR,
  isFormError,
});

export const addTask = (arrearsId, title, description, date, owner, raisedBy) => async dispatch => {
  dispatch(clearTaskError());
  dispatch(addingTask());
  try {
    await tasksApi.addTask({
      title,
      description,
      dueTime: date,
      owner,
      raisedBy,
      regardingObject: { type: 'case', id: arrearsId },
    });
    dispatch(taskAdded());
  } catch (error) {
    dispatch(taskError());
    throw new Error(error);
  }
};

export const getTasksSummary = opts => async dispatch => {
  dispatch(loading());
  try {
    const { data } = await getTasksSummaryApi({ ...objectWithoutNullProperties(opts) });
    dispatch(setSummaryTasks(data));
  } catch (e) {
    dispatch(setSummaryTasks([]));
  }
};

export const getTasks = opts => async dispatch => {
  dispatch(loading());
  try {
    const { data } = await getTasksApi({ ...opts });
    dispatch(setTasks(data));
  } catch (e) {
    dispatch(setTasks([]));
  }
};

export const invalidateTasks = () => dispatch => {
  dispatch(setTasks([]));
};

export const invalidateSummaryTasks = () => dispatch => {
  dispatch(setSummaryTasks([]));
};

export const getStatuses = opts => async dispatch => {
  try {
    const { data } = await getTasksStatuses({
      ...objectWithoutNullProperties(opts),
      EntityType: 'Arrears',
    });
    dispatch(setStatuses(data));
  } catch (e) {
    dispatch(setStatuses([]));
  }
};

export const cancelTask = (taskId, params) => async dispatch => {
  try {
    dispatch(loading());
    await patchTaskStatus(taskId, params);
    dispatch(taskActionSuccess());
  } catch (e) {
    dispatch(taskActionError());
    throw new Error(e);
  }
};

export const closeTask = (taskId, params) => async dispatch => {
  try {
    dispatch(loading());
    await patchTaskStatus(taskId, params);
    dispatch(taskActionSuccess());
  } catch (e) {
    dispatch(taskActionError());
    throw new Error(e);
  }
};

export const reassignTask = (taskId, params) => async dispatch => {
  try {
    dispatch(loading());
    await patchTaskOwner(taskId, params);
    dispatch(taskActionSuccess());
  } catch (e) {
    dispatch(taskActionError());
    throw new Error(e);
  }
};
