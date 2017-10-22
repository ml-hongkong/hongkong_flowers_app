// @flow

import type { Action } from './types';
import { API_START, API_DONE } from '../constants';

export function apiStart(): Action {
  return {
    type: API_START,
  };
}

export function apiDone(error?: Object): Action {
  return {
    type: API_DONE,
    payload: error,
  };
}

export function apiSuccess(type: string, data: any): Action {
  return {
    type,
    payload: data,
  };
}

export function apiPending(type: string) {
  return {
    type,
  };
}

export function apiError(type: string, error?: Object): Action {
  return {
    type,
    payload: error,
  };
}
