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
  [IMAGE_UPLOAD.SUCCESS]: (state, action) => {
    // find the highest probability prediction
    const predicated = [...action.payload.predictions]
      .sort((a, b) => {
        if (a.probability > b.probability) return -1;
        if (a.probability < b.probability) return 1;
        return 0;
      })[0];

    return {
      error: null,
      name: predicated.name,
      probability: predicated.probability,
      pending: false,
    };
  },
  [IMAGE_UPLOAD.ERROR]: (state, action) => ({
    error: action.payload,
    pending: false,
  }),
}, initialState);
