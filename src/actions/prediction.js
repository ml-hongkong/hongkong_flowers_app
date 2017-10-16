// @flow

import { API_UPLOAD, FLOWER_PREDICTION } from '../constants';

// eslint-disable-next-line
export function fetchFlowerPrediction({ image, lat, lng }) {
  return {
    type: API_UPLOAD,
    payload: {
      endpoint: '/predict',
      data: {
        image,
        lat,
        lng,
      },
      next: FLOWER_PREDICTION,
    },
  };
}
