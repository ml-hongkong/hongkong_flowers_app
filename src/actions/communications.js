// @flow

import type { Action, Error } from './types';
import { API_START, API_DONE } from '../constants';

type ApiDone = {
  error?: Error,
}

type ApiSuccess = {
  type: string,
  payload?: any,
}

type ApiError = {
  type: string,
  payload: Error,
}

export function apiStart(): Action {
  return {
    type: API_START,
  };
}

export function apiDone(error: ApiDone): Action {
  return {
    type: API_DONE,
    payload: error,
  };
}

export function apiSuccess({ type, data }: ApiSuccess): Action {
  return {
    type,
    payload: data,
  };
}

export function apiError({ type, error }: ApiError): Action {
  return {
    type,
    payload: error,
  };
}
