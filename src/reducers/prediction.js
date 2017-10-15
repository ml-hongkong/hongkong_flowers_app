import { handleActions } from 'redux-actions';
import { FLOWER_PREDICTION } from '../constants';

const initialState = {
  pending: false,
  error: null,
  predictions: [],
};

export default handleActions({
  [FLOWER_PREDICTION.PENDING]: (state, action) => ({
    ...action.payload,
    pending: true,
    predictions: [],
  }),
  [FLOWER_PREDICTION.SUCCESS]: (state, action) => {
    // sorting
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
  [FLOWER_PREDICTION.ERROR]: (state, action) => ({
    error: action.payload,
    pending: false,
    predictions: [],
  }),
}, initialState);
