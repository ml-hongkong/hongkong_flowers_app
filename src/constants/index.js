// async action types
const asyncActionType = type => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

// Dynamic API Status
export const API_STATUS = asyncActionType('API_STATUS');

export const API_START = 'API_START';
export const API_DONE = 'API_DONE';

// API actions
export const API_REQUEST = 'API_REQUEST';
export const API_POST = 'API_POST';
export const API_UPLOAD = 'API_UPLOAD';
export const API_ERROR = 'API_ERROR';

// Firebase actions
export const FIREBASE_AUTH = 'FIREBASE_AUTH';

export const FIREBASE = asyncActionType('FIREBASE');

// User Auth
export const SIGN_IN = asyncActionType('SIGN_IN');
export const SIGN_UP = asyncActionType('SIGN_UP');
export const SIGN_OUT = 'SIGN_UP';

// Application Operations
export const IMAGE_UPLOAD = asyncActionType('IMAGE_UPLOAD');
export const ADD_IMAGE = 'ADD_IMAGE';
export const REMOVE_IMAGE = 'REMOVE_IMAGE';
export const SET_AUTHORIZATION = 'SET_AUTHORIZATION';
export const INCREASE_UPLOAD_PROGRESS = 'INCREASE_UPLOAD_PROGRESS';
