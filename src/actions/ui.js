// @flow

import { SET_IMAGE_PREVIEW, REMOVE_IMAGE_PREVIEW } from '../constants';

export function setImagePreview(imageUri) {
  return {
    type: SET_IMAGE_PREVIEW,
    payload: imageUri,
  };
}

export function removeImagePreview() {
  return {
    type: REMOVE_IMAGE_PREVIEW,
  };
}
