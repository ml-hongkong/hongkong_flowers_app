// @flow

import { API_UPLOAD, IMAGE_UPLOAD } from '../constants';

// eslint-disable-next-line
export function fetchFlowerPrediction({
  imageURL,
  lat,
  lng,
  filename = `${Date.now()}.jpeg`,
} = {}) {
  const formData = new FormData();
  formData.append('image', {
    uri: imageURL,
    type: 'image/jpeg',
    filename,
  });
  formData.append('lat', lat);
  formData.append('lng', lng);

  return {
    type: API_UPLOAD,
    payload: {
      endpoint: '/predictions',
      data: formData,
      next: IMAGE_UPLOAD,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  };
}
