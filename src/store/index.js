// @flow
/* eslint no-underscore-dangle: 0 */ // --> OFF

import { AsyncStorage } from 'react-native';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
// eslint-disable-next-line
import { createLogger } from 'redux-logger';
import { autoRehydrate, persistStore } from 'redux-persist';
import api from './api';
import firebase from './firebase';
import reducers from '../reducers';

// wrapper for redux store
export class AppStore {
  constructor() {
    this.store = null;
  }

  get store(): Object {
    if (!this.__store__) {
      throw Error('store not yet created, must call createStore() before accessing store');
    }
    return this.__store__;
  }

  set store(store: Object): void {
    this.__store__ = store;
  }

  get loaded(): boolean {
    return !!this.__store__;
  }

  createStore(onComplete: ?() => void): Object {
    const middlewares = [
      api,
      firebase,
    ];

    if (__DEV__) {
      middlewares.push(createLogger({
        duration: true,
        timestamp: true,
        diff: true,
      }));
    }
    const store = createStore(
      combineReducers(reducers),
      compose(
        applyMiddleware(...middlewares),
        autoRehydrate(),
      ),
    );

    persistStore(store, { storage: AsyncStorage }, onComplete);
    this.store = store;
    return store;
  }
}

// a proxy for appStore api to provide some magic.
// caller can access redux store's properties directly.
// for example: appStore.getState()
export default new Proxy(new AppStore(), {
  get(target, key) {
    const disallowedProps = ['store', '__store__'];
    if (disallowedProps.includes(key)) {
      return undefined;
    } else if (target[key]) {
      return target[key];
    }
    return target.store[key];
  },
});
