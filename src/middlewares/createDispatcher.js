// @flow

import { apiSuccess, apiError, apiStart, apiDone } from '../actions';

export default (dispatch: Function, action: Object) => ({
  success(data?: any): any {
    dispatch(apiDone());
    dispatch(apiSuccess({ type: action.payload.next.SUCCESS, data }));
    return data;
  },

  notify(data?: any): any {
    (action.payload.success || [])
      .forEach(callback => dispatch(callback(data)));
    return data;
  },

  start(): void {
    dispatch(apiStart());
    dispatch({ type: action.payload.next.PENDING });
  },

  error(error?: Object): Object {
    dispatch(apiDone(error));
    dispatch(apiError({ type: action.payload.next.ERROR, error }));
    return error;
  },
});
