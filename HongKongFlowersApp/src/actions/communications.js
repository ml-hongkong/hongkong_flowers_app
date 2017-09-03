export function apiSuccess({ type, data }) {
  return {
    type,
    payload: data,
  };
}

export function apiError({ type, error }) {
  return {
    type,
    payload: error,
  };
}
