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
    const topN = action.payload.top_n
      // sorting
      .sort((a, b) => {
        if (a.prob > b.prob) return -1;
        if (a.prob < b.prob) return 1;
        return 0;
      })
      // lmit to 3
      .slice(0, 3);

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
