
import { handleActions } from 'redux-actions';
import { SET_IMAGE_PREVIEW, REMOVE_IMAGE_PREVIEW } from '../constants';

const initialState = {
  imagePreview: null,
};

export default handleActions({
  [SET_IMAGE_PREVIEW]: (state, action) => ({
    imagePreview: {
      uri: action.payload,
    },
  }),
  [REMOVE_IMAGE_PREVIEW]: () => ({
    imagePreview: null,
  }),
}, initialState);
