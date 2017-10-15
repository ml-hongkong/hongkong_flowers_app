// @flow

import { API_UPLOAD, FLOWER_PREDICTION } from '../constants';
import { imageUriToBase64 } from '../common';

// eslint-disable-next-line
export function fetchFlowerPrediction({ imageUri, lat, lng }) {
  return {
    type: API_UPLOAD,
    payload: {
      image: imageUriToBase64(imageUri),
      lat,
      lng,
      next: FLOWER_PREDICTION,
    },
  };
}
