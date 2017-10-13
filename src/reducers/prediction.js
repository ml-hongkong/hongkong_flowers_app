import { handleActions } from 'redux-actions';
import { IMAGE_PREDICTION } from '../constants';

const initialState = {
  pending: false,
  error: null,
  predictions: [],
};

export default handleActions({
  [IMAGE_PREDICTION.PENDING]: (state, action) => ({
    ...action.payload,
    pending: true,
    predictions: [],
  }),
  [IMAGE_PREDICTION.SUCCESS]: (state, action) => {
    // find the highest probability prediction
    const topN = [...action.payload]
      .sort((a, b) => {
        if (a.prob > b.prob) return -1;
        if (a.prob < b.prob) return 1;
        return 0;
      });

    return {
      error: null,
      predictions: topN,
      pending: false,
    };
  },
  [IMAGE_PREDICTION.ERROR]: (state, action) => ({
    error: action.payload,
    pending: false,
    predictions: [],
  }),
}, initialState);
