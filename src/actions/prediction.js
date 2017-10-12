// @flow

import { FIREBASE_IMAGE_UPLOAD, IMAGE_PREDICTION } from '../constants';

// eslint-disable-next-line
export function fetchFlowerPrediction({
  imageURL,
  lat,
  lng,
} = {}) {
  return {
    type: FIREBASE_IMAGE_UPLOAD,
    payload: {
      imageURL,
      lat,
      lng,
      next: IMAGE_PREDICTION,
    },
  };
}
