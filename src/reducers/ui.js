
import { handleActions } from 'redux-actions';
import { UPDATE_IMAGE_PREVIEW } from '../constants';

const initialState = {
  imagePreview: null,
};

export default handleActions({
  [UPDATE_IMAGE_PREVIEW]: (state, action) => ({
    imagePreview: {
      uri: action.payload.uri,
    },
  }),
}, initialState);
