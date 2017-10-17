import { LoginManager } from 'react-native-fbsdk';
import { SIGN_IN, SIGN_OUT, FIREBASE_AUTH } from '../constants';

export function loginWithFacebook(accessToken) {
  return {
    type: FIREBASE_AUTH,
    payload: {
      provider: 'facebook',
      accessToken,
      next: SIGN_IN,
    },
  };
}

export function logout() {
  LoginManager.logOut();
  return {
    type: SIGN_OUT,
  };
}
