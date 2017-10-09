import { handleActions } from 'redux-actions';
import { API_START, API_DONE } from '../constants';

const initialState = {
  requests: 0,
  error: null,
};

export default handleActions({
  [API_START]: state => ({
    requests: state.requests + 1,
    error: null,
  }),
  [API_DONE]: (state, action) => ({
    requests: state.requests - 1,
    error: action.payload, // store the last api error
  }),
}, initialState);
