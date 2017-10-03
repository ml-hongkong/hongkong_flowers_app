import { handleActions } from 'redux-actions';
import { SIGN_IN, SIGN_OUT } from '../constants';

const initialState = {
  displayName: null,
  photoURL: null,
  loggedIn: false,
  signing: false,
};

export default handleActions({
  [SIGN_IN.SUCCESS]: (state, action) => ({
    displayName: action.payload.displayName,
    photoURL: action.payload.photoURL,
    loggedIn: true,
    signing: false,
  }),
  [SIGN_IN.PENDING]: () => ({
    loggedIn: false,
    signing: true,
  }),
  [SIGN_OUT]: () => ({ ...initialState }),
}, initialState);
