// @flow

import store from '../store';
import { API_UPLOAD, FLOWER_PREDICTION } from '../constants';

// eslint-disable-next-line
export function fetchFlowerPrediction({ image, lat, lng }) {
  const { userId: uid } = store.getStore().getState().auth;
  return {
    type: API_UPLOAD,
    payload: {
      endpoint: '/predict',
      data: {
        image,
        uid,
        lat,
        lng,
      },
      next: FLOWER_PREDICTION,
    },
  };
}
