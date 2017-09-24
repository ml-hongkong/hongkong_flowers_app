import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
// eslint-disable-next-line
import { createLogger } from 'redux-logger';
import { apiMiddleware, firebaseMiddleware } from '../middlewares';
import reducers from '../reducers';

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

export default () => {
  const store = createStore(
    combineReducers(reducers),
    compose(applyMiddleware(...middlewares)),
  );
  return store;
};
