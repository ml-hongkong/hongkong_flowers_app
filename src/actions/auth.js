// @flow

import { LoginManager } from 'react-native-fbsdk';
import type { Action } from './types';
import { SIGN_IN, SIGN_OUT, FIREBASE_AUTH } from '../constants';

export function loginWithFacebook(accessToken): Action {
  return {
    type: FIREBASE_AUTH,
    payload: {
      provider: 'facebook',
      accessToken,
      next: SIGN_IN,
    },
  };
}

export function logout(): Action {
  LoginManager.logOut();
  return {
    type: SIGN_OUT,
  };
}
