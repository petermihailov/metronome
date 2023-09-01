export interface Action<T = string, P = void> {
  type: T;
  payload: P;
}

export function createAction<T extends Action<string, unknown>>(type: T['type']) {
  return (payload: T['payload']) => ({ type, payload });
}
