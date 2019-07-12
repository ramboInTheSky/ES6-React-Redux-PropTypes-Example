import { arrearsApi } from '../../api';
import reducer, {
  initialState,
  approvePause,
  cancelPause,
  clearPauseError,
  createPause,
  pausesLoading,
  setPause,
  setPauseError,
  setPauseRules,
  getPause,
  getPauseRules,
  patchPause,
  patchPauseComplete,
  invalidateActivePause,
  PAUSES_LOADING,
  SET_PAUSE_RULES,
  SET_PAUSE,
  PATCH_PAUSE_COMPLETE,
  declinePause,
} from './';

const mockPauseRules = {
  pauseReasons: [
    {
      id: 'abc123',
      title: 'A reason',
      myRule: {
        endDate: '2018-07-27T13:56:50.951Z',
      },
      managerRule: {
        endDate: '2018-07-27T13:56:50.951Z',
      },
    },
    {
      id: 'def456',
      title: 'Another reason',
      myRule: {
        endDate: '2018-07-27T13:56:50.951Z',
      },
      managerRule: {
        endDate: '2018-07-27T13:56:50.951Z',
      },
    },
  ],
};

jest.mock('../../api', () => ({
  arrearsApi: {
    createPause: jest.fn((id, payload) => ({ data: { [id]: payload } })),
    deletePause: jest.fn(() => {}),
    getPause: jest.fn(() => ({
      data: mockPauseRules,
    })),
    getPauseRules: jest.fn(() => ({
      data: mockPauseRules,
    })),
    patchPause: jest.fn(() => {}),
  },
}));

describe('Pause reducer', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set a default state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('returns untouched state by default', () => {
    const result = reducer(initialState, {});
    expect(result).toEqual(initialState);
  });

  it('generates the correct state for a clearPauseError action', () => {
    const result = reducer(initialState, clearPauseError());
    expect(result).toEqual({
      ...initialState,
      error: false,
    });
  });

  it('generates the correct state for a pausesLoading action', () => {
    const result = reducer(initialState, pausesLoading());
    expect(result).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it('generates the correct state for a patchPauseComplete action', () => {
    const result = reducer(initialState, patchPauseComplete());
    expect(result).toEqual({
      ...initialState,
      loading: false,
    });
  });

  it('generates the correct state for a setPauseRules action', () => {
    const result = reducer(initialState, setPauseRules(mockPauseRules));
    expect(result).toEqual({
      ...initialState,
      loading: false,
      pauseRules: mockPauseRules.pauseReasons,
    });
  });

  it('generates the correct state for a setPause action', () => {
    const result = reducer(initialState, setPause({ foo: 'bar' }));
    expect(result).toEqual({
      ...initialState,
      loading: false,
      activePause: { foo: 'bar' },
    });
  });

  it('generates the correct state for a setPauseError action', () => {
    const result = reducer(initialState, setPauseError());
    expect(result).toEqual({
      ...initialState,
      loading: false,
      error: true,
    });
  });

  it('generates the correct state for a invalidateActivePause action', () => {
    const result = reducer(
      { ...initialState, activePause: { foo: 'bar' } },
      invalidateActivePause()
    );
    expect(result).toEqual({
      ...initialState,
      activePause: null,
    });
  });

  it('performs the correct actions for getPauseRules', async () => {
    await getPauseRules('abc', '123')(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.getPauseRules).toBeCalledWith('abc', '123');
    expect(dispatch).toBeCalledWith({
      type: SET_PAUSE_RULES,
      payload: mockPauseRules,
    });
  });

  it('performs the correct actions for getPause', async () => {
    await getPause('abc', '123')(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.getPause).toBeCalledWith('abc', '123');
    expect(dispatch).toBeCalledWith({
      type: SET_PAUSE,
      payload: mockPauseRules,
    });
  });

  it('performs the correct actions for createPause', async () => {
    await createPause('abc', { bar: 'baz' })(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.createPause).toBeCalledWith('abc', { bar: 'baz' });
    expect(dispatch).toBeCalledWith({
      type: SET_PAUSE,
      payload: { abc: { bar: 'baz' } },
    });
  });

  it('performs the correct actions for patchPause', async () => {
    await patchPause('abc', '123', { bar: 'baz' })(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.patchPause).toBeCalledWith('abc', '123', { bar: 'baz' });
    expect(dispatch).toBeCalledWith({ type: PATCH_PAUSE_COMPLETE });
  });

  it('performs the correct actions for approvePause', async () => {
    await approvePause('abc', '123')(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.patchPause).toBeCalledWith('abc', '123', null, 'approve');
    expect(dispatch).toBeCalledWith({ type: PATCH_PAUSE_COMPLETE });
  });

  it('performs the correct actions for approvePause if reason is an empty string', async () => {
    await approvePause('abc', '123', '')(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.patchPause).toBeCalledWith('abc', '123', null, 'approve');
    expect(dispatch).toBeCalledWith({ type: PATCH_PAUSE_COMPLETE });
  });

  it('performs the correct actions for approvePause if a reason for declining is passed', async () => {
    await approvePause('abc', '123', 'Nu uh')(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.deletePause).toBeCalledWith('abc', '123', { description: 'Nu uh' });
    expect(dispatch).toBeCalledWith({ type: PATCH_PAUSE_COMPLETE });
  });

  it('performs the correct actions for declinePause', async () => {
    await declinePause('abc', '123', { description: 'Gotham is safe' })(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.deletePause).toBeCalledWith('abc', '123', { description: 'Gotham is safe' });
    expect(dispatch).toBeCalledWith({ type: PATCH_PAUSE_COMPLETE });
  });

  it('performs the correct actions for cancelPause', async () => {
    await cancelPause('abc', '123', { bar: 'baz' })(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.patchPause).toBeCalledWith('abc', '123', { bar: 'baz' }, 'cancel');
    expect(dispatch).toBeCalledWith({ type: PATCH_PAUSE_COMPLETE });
  });

  it('performs the correct actions for cancelPause with no payload', async () => {
    await cancelPause('abc', '123')(dispatch);
    expect(dispatch).toBeCalledWith({ type: PAUSES_LOADING });
    expect(arrearsApi.patchPause).toBeCalledWith('abc', '123', {}, 'cancel');
    expect(dispatch).toBeCalledWith({ type: PATCH_PAUSE_COMPLETE });
  });
});
