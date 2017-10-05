import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import LoginModal from './login/LoginModal';
import FlowerPredictionView from './views/FlowerPredictionView';

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
    backgroundColor: '#000000',
  },
});

class AppNavigator extends PureComponent {
  static configureScene(route) {
    if (route.name === 'login') {
      return Navigator.SceneConfigs.FloatFromBottom;
    }
    if (route.name === 'flowerPrediction') {
      return Navigator.SceneConfigs.HorizontalSwipeJump;
    }
    return Navigator.SceneConfigs.FloatFromRight;
  }

  static renderScene(route, navigator) {
    if (route.name === 'login') {
      return <LoginModal navigator={navigator} />;
    }
    if (route.name === 'flowerPrediction') {
      return <FlowerPredictionView navigator={navigator} />;
    }
    return <FlowerPredictionView navigator={navigator} />;
  }

  render() {
    return (
      <Navigator
        initialRoute={{
          name: 'flowerPrediction',
        }}
        renderScene={AppNavigator.renderScene}
        configureScene={AppNavigator.configureScene}
        style={styles.navigator}
      />
    );
  }
}

export default AppNavigator;
