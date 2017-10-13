import {
  API_START,
  API_DONE,
  API_REQUEST,
  API_POST,
  API_UPLOAD,
  FIREBASE_AUTH,
  SIGN_IN,
  SIGN_OUT,
  IMAGE_UPLOAD,
} from '../constants';

export type Error = {
  status: number,
  message: string,
}

export type Action =
    { type: SIGN_IN.PENDING }
  | { type: SIGN_IN.Error, payload: Error }
  | { type: SIGN_IN.SUCCESS, payload: Object }
  | { type: IMAGE_UPLOAD.PENDING }
  | { type: IMAGE_UPLOAD.Error, payload: Error }
  | { type: IMAGE_UPLOAD.SUCCESS, payload: Object }
  | { type: SIGN_OUT }
  | { type: API_START }
  | { type: API_DONE, payload?: Error }
  | { type: API_REQUEST, payload?: Object }
  | { type: API_POST, payload: Object }
  | { type: API_UPLOAD, payload: Object }
  | { type: FIREBASE_AUTH, payload: { provider: 'facebook', accessToken: string, next: Object } }
