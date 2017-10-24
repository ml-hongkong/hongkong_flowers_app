// @flow

import { UPDATE_IMAGE_PREVIEW } from '../constants';
import type { Action } from './types';

// eslint-disable-next-line
export function updateImagePreview(uri?: string): Action {
  return {
    type: UPDATE_IMAGE_PREVIEW,
    payload: {
      uri,
    },
  };
}
