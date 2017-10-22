// @flow

import type { Action } from './types';
import { API_UPLOAD, FLOWER_PREDICTION } from '../constants';

// eslint-disable-next-line
export function fetchFlowerPrediction({ userId, image, lat, lng }: {
  userId: string,
  image: string,
  lat: number,
  lng: number,
}): Action {
  return {
    type: API_UPLOAD,
    payload: {
      endpoint: '/predict',
      data: {
        image,
        lat,
        lng,
        uid: userId,
      },
      next: FLOWER_PREDICTION,
    },
  };
}
