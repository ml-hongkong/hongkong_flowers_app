import { handleActions } from 'redux-actions';
import { IMAGE_UPLOAD } from '../constants';

const initialState = {
  pending: false,
  error: null,
};

export default handleActions({
  [IMAGE_UPLOAD.PENDING]: (state, action) => ({
    ...action.payload,
    pending: true,
  }),
  [IMAGE_UPLOAD.SUCCESS]: (state, action) => ({
    error: null,
    ...action.payload,
    pending: false,
  }),
  [IMAGE_UPLOAD.ERROR]: (state, action) => ({
    error: action.payload,
    pending: false,
  }),
}, initialState);
