// async action types
const asyncActionType = type => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
});

export const API_START = 'API_START';
export const API_DONE = 'API_DONE';

// API actions
export const API_REQUEST = 'API_REQUEST';
export const API_POST = 'API_POST';
export const API_UPLOAD = 'API_UPLOAD';
export const API_ERROR = 'API_ERROR';

// Firebase actions
export const FIREBASE = asyncActionType('FIREBASE');
export const FIREBASE_AUTH = 'FIREBASE_AUTH';
export const FIREBASE_IMAGE_UPLOAD = 'FIREBASE_IMAGE_UPLOAD';
export const FIREBASE_ADD = 'FIREBASE_ADD';
export const FIREBASE_SUBSCRIBE = 'FIREBASE_SUBSCRIBE';
export const FIREBASE_UPDATE = 'FIREBASE_UPDATE';

// User Auth
export const SIGN_IN = asyncActionType('SIGN_IN');
export const SIGN_UP = asyncActionType('SIGN_UP');
export const SIGN_OUT = 'SIGN_OUT';

// Application Operations
export const FLOWER_PREDICTION = asyncActionType('FLOWER_PREDICTION');
export const UPDATE_IMAGE_PREVIEW = 'UPDATE_IMAGE_PREVIEW';
export const IMAGE_UPLOAD = asyncActionType('IMAGE_UPLOAD');
export const FLOWER_REPORT = asyncActionType('FLOWER_REPORT');
export const CLEAN_FLOWER_REPORT = 'CLEAN_FLOWER_REPORT';
