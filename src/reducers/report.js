import { handleActions } from 'redux-actions';
import { FLOWER_REPORT, CLEAN_FLOWER_REPORT } from '../constants';

const initialState = {
  pending: false,
  error: null,
  success: false,
};

export default handleActions({
  [FLOWER_REPORT.PENDING]: () => ({
    success: false,
    pending: true,
    error: null,
  }),
  [FLOWER_REPORT.SUCCESS]: () => ({
    success: true,
    pending: false,
    error: null,
  }),
  [FLOWER_REPORT.ERROR]: (state, action) => ({
    error: action.payload,
    pending: false,
    success: false,
  }),
  [CLEAN_FLOWER_REPORT]: () => initialState,
}, initialState);
