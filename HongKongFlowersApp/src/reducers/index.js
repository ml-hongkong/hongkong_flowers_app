import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import auth from './auth';
import { apiMiddleware, firebaseMiddleware } from '../middlewares';

const middlewares = [
  apiMiddleware,
  firebaseMiddleware,
];

export default createStore(
  combineReducers({
    auth,
  }),
  compose(applyMiddleware(...middlewares)),
);
