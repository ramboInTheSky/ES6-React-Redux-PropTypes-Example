import reducer, {
  invalidateTasks,
  invalidateSummaryTasks,
  addingTask,
  cancelTask,
  clearActionErrors,
  clearTaskError,
  closeTask,
  reassignTask,
  taskAdded,
  taskActionError,
  taskError,
  addTask,
  getTasksSummary,
  getTasks,
  getStatuses,
  ADDING_TASK,
  CLEAR_TASK_ERROR,
  TASK_ADDED,
  TASK_ERROR,
  GETTING_TASKS,
  SET_TASKS,
  SET_SUMMARY_TASKS,
  SET_STATUSES,
} from './';
import * as api from '../../api';

jest.mock('uuid/v4', () => () => 'guid');

jest.mock('../../api', () => ({
  tasksApi: {
    addTask: jest.fn(x => x.title === 'fail' && Promise.reject()),
    getTasks: jest.fn(params => ({
      data: [{ id: 'foo', ...params }],
    })),
    getTasksSummary: jest.fn(params => ({
      data: [{ id: 'foo', ...params }],
    })),
    getStatuses: jest.fn(params => ({
      data: [{ id: 'foo', ...params }],
    })),
    invalidateTasks: jest.fn(),
    invalidateSummaryTasks: jest.fn(),
    patchTaskOwner: jest.fn(),
    patchTaskStatus: jest.fn(),
  },
}));

describe('tasks reducer', () => {
  let dispatch;
  let currentState;

  beforeEach(() => {
    currentState = { foo: 'bar' };
    dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses default initial state if no state passed', () => {
    const result = reducer(undefined, {});
    expect(result).toEqual({
      statuses: {},
      summaryItems: [],
      items: [],
      error: false,
      loading: false,
      modalActionError: false,
    });
  });

  it('returns untouched state by default', () => {
    const result = reducer(currentState, {});
    expect(result).toEqual(currentState);
  });

  it('generates the correct state for a addingTask action', () => {
    const result = reducer(currentState, addingTask());
    expect(result).toEqual({
      foo: 'bar',
      error: false,
      loading: true,
    });
  });

  it('generates the correct state for a clearActionErrors action', () => {
    const result = reducer(currentState, clearActionErrors());
    expect(result).toEqual({
      foo: 'bar',
      modalActionError: false,
      loading: false,
    });
  });

  it('generates the correct state for a addingTask action', () => {
    const result = reducer(currentState, clearTaskError());
    expect(result).toEqual({
      foo: 'bar',
      error: false,
      loading: false,
    });
  });

  it('generates the correct state for a taskError  action', () => {
    const result = reducer(currentState, taskError());
    expect(result).toEqual({
      foo: 'bar',
      error: true,
      isFormError: false,
      loading: false,
    });
  });

  it('generates the correct state for a taskActionError modalActionError=true action', () => {
    const result = reducer(currentState, taskActionError());
    expect(result).toEqual({
      foo: 'bar',
      modalActionError: true,
      loading: false,
    });
  });

  it('generates the correct state for a taskError isFormError=true action', () => {
    const result = reducer(currentState, taskError(true));
    expect(result).toEqual({
      foo: 'bar',
      error: true,
      isFormError: true,
      loading: false,
    });
  });

  it('generates the correct state for a taskAdded action', () => {
    const result = reducer(currentState, taskAdded());
    expect(result).toEqual({
      foo: 'bar',
      error: false,
      loading: false,
    });
  });

  it('performs the correct actions for addTask', async () => {
    const arrearsId = 'ARREARS_ID';
    const title = 'TITLE';
    const description = 'DESCRIPTION';
    const date = 'DATE';
    const owner = 'OWNER';
    const raisedBy = 'RAISEDBY';

    await addTask(arrearsId, title, description, date, owner, raisedBy)(dispatch);

    expect(dispatch).toBeCalledWith({ type: CLEAR_TASK_ERROR });
    expect(dispatch).toBeCalledWith({ type: ADDING_TASK });
    expect(api.tasksApi.addTask).toBeCalledWith({
      title,
      description,
      dueTime: date,
      owner,
      raisedBy,
      regardingObject: { type: 'case', id: arrearsId },
    });
    expect(dispatch).toBeCalledWith({ type: TASK_ADDED });
  });

  it('performs the correct actions for addTask when an error is thrown', async () => {
    expect.assertions(1);
    await addTask(null, 'fail')(dispatch).catch(() => {
      expect(dispatch).toBeCalledWith({ type: TASK_ERROR, isFormError: false });
    });
  });

  it('performs the correct actions to invalidate tasks', async () => {
    invalidateTasks()(dispatch);
    expect(dispatch).toBeCalledWith({
      payload: [],
      type: SET_TASKS,
    });
  });

  it('performs the correct actions to invalidate summary tasks', async () => {
    invalidateSummaryTasks()(dispatch);
    expect(dispatch).toBeCalledWith({
      payload: [],
      type: SET_SUMMARY_TASKS,
    });
  });

  it('performs the correct actions for getTasksSummary', async () => {
    await getTasksSummary({})(dispatch);
    expect(dispatch).toBeCalledWith({ type: GETTING_TASKS });
    expect(api.tasksApi.getTasksSummary).toBeCalled();
    expect(dispatch).toBeCalledWith({
      payload: [{ id: 'foo' }],
      type: SET_SUMMARY_TASKS,
    });
  });

  it('performs the correct actions for getTasks', async () => {
    await getTasks()(dispatch);
    expect(dispatch).toBeCalledWith({ type: GETTING_TASKS });
    expect(api.tasksApi.getTasks).toBeCalled();
    expect(dispatch).toBeCalledWith({
      payload: [{ id: 'foo' }],
      type: SET_TASKS,
    });
  });

  it('performs the correct actions for getStatuses', async () => {
    await getStatuses({})(dispatch);
    expect(api.tasksApi.getStatuses).toBeCalled();
    expect(dispatch).toBeCalledWith({
      payload: [{ EntityType: 'Arrears', id: 'foo' }],
      type: SET_STATUSES,
    });
  });

  it('performs the correct actions for cancelTask', async () => {
    const taskId = 'taskID';
    const params = {};
    await cancelTask(taskId, params)(dispatch);
    expect(api.tasksApi.patchTaskStatus).toBeCalledWith(taskId, params);
  });

  it('performs the correct actions for closeTask', async () => {
    const taskId = 'taskID';
    const params = {};
    await closeTask(taskId, params)(dispatch);
    expect(api.tasksApi.patchTaskStatus).toBeCalledWith(taskId, params);
  });

  it('performs the correct actions for reassignTask', async () => {
    const taskId = 'taskID';
    const params = {};
    await reassignTask(taskId, params)(dispatch);
    expect(api.tasksApi.patchTaskOwner).toBeCalledWith(taskId, params);
  });
});
