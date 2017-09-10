import { handleActions } from 'redux-actions';
import { SIGN_IN, SIGN_OUT } from '../constants';

const initialState = {
  displayName: null,
  photoURL: null,
  signedIn: false,
  signing: false,
};

export default handleActions({
  [SIGN_IN.SUCCESS]: (state, action) => ({
    displayName: action.payload.displayName,
    photoURL: action.payload.photoURL,
    signedIn: true,
    signing: false,
  }),
  [SIGN_IN.PENDING]: () => ({
    signedIn: false,
    signing: true,
  }),
  [SIGN_OUT]: () => ({ ...initialState }),
}, initialState);
