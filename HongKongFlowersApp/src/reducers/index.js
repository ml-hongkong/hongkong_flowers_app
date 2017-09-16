import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
// eslint-disable-next-line
import { createLogger } from 'redux-logger';
import auth from './auth';
import prediction from './prediction';
import { apiMiddleware, firebaseMiddleware } from '../middlewares';

const middlewares = [
  apiMiddleware,
  firebaseMiddleware,
];

if (__DEV__ === true) {
  middlewares.push(createLogger({
    duration: true,
    timestamp: true,
    diff: true,
  }));
}

export default createStore(
  combineReducers({
    auth,
    prediction,
  }),
  compose(applyMiddleware(...middlewares)),
);
