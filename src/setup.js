import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

export default function setup() {
  return class Root extends PureComponent {
    state = {
      store: store.createStore(() => this.setState({ loaded: true })),
      loaded: false,
    }

    render() {
      if (!this.state.loaded) {
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
