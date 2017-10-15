import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
// eslint-disable-next-line
import { createLogger } from 'redux-logger';
import { autoRehydrate, persistStore } from 'redux-persist';
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

export default (onComplete: ?() => void) => {
  const store = createStore(
    combineReducers(reducers),
    compose(
      applyMiddleware(...middlewares),
      autoRehydrate(),
    ),
  );

  persistStore(store, { storage: AsyncStorage }, onComplete);
  return store;
};
