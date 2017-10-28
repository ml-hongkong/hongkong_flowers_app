// @flow

import type { Action } from './types';
import { API_POST, CLEAN_FLOWER_REPORT, FLOWER_REPORT } from '../constants';

export function reportEntity(entityId): Action {
  return {
    type: API_POST,
    payload: {
      endpoint: '/report',
      data: { entityId },
      next: FLOWER_REPORT,
    },
  };
}

export function cleanReport(): Action {
  return {
    type: CLEAN_FLOWER_REPORT,
    payload: {},
  };
}
