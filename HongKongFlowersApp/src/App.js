import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import { Provider } from 'react-redux';
import store from './reducers';
import LoginModal from './login/LoginModal';
import CameraView from './views/CameraView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  navigator: {
    flex: 1,
    backgroundColor: '#000000',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class App extends Component {
  // eslint-disable-next-line
  configureScene(route) {
    if (route.name === 'login') {
      return Navigator.SceneConfigs.FloatFromBottom;
    }
    return Navigator.SceneConfigs.FloatFromRight;
  }

  // eslint-disable-next-line
  renderScene(route, navigator) {
    if (route.name === 'login') {
      return <LoginModal navigator={navigator} />;
    }
    if (route.name === 'camera') {
      return <CameraView navigator={navigator} />;
    }
    return <CameraView navigator={navigator} />;
  }

  render() {
    return (
      <Provider store={store}>
        <Navigator
          initialRoute={{
            name: 'camera',
            title: '',
          }}
          renderScene={this.renderScene}
          configureScene={this.configureScene}
          style={styles.navigator}
        />
      </Provider>
    );
  }
}

// eslint-disable-next-line
console.ignoredYellowBox = ['Remote debugger'];
export default App;
