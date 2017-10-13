import React, { PureComponent } from 'react';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import createStore from './store/createStore';
import App from './App';

const store = createStore();

export default function setup() {
  return class Root extends PureComponent {
    state = {
      store,
      rehydrated: false,
    }

    componentWillMount() {
      console.log(store);
      persistStore(store, { storage: AsyncStorage }, () => {
        console.log('d');
        this.setState({ rehydrated: true });
      });
    }

    render() {
      if (!this.state.rehydrated) {
        return null;
      }

      return (
        <Provider store={this.state.store}>
          <App />
        </Provider>
      );
    }
  };
}

// eslint-disable-next-line
console.ignoredYellowBox = ['Remote debugger'];
