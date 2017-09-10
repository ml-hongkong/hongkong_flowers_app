import { apiSuccess, apiError } from '../actions';

export default (dispatch, action) => ({
  success: (data) => {
    dispatch(apiSuccess({ type: action.payload.next.SUCCESS, data }));
    return data;
  },

  notify: (data) => {
    (action.payload.success || [])
      .forEach(callback => dispatch(callback(data)));
    return data;
  },

  start: () => {
    dispatch({ type: action.payload.next.PENDING });
  },

  error: (error) => {
    dispatch(apiError({ type: action.payload.next.ERROR, error }));
    return error;
  },
});
