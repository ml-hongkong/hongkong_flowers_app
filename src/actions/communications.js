import { API_START, API_DONE } from '../constants';

export function apiStart() {
  return {
    type: API_START,
  };
}

export function apiDone(error) {
  return {
    type: API_DONE,
    payload: error,
  };
}

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
