import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import LoginModal from './login/LoginModal';
import FlowerPredictionView from './views/FlowerPredictionView';

const styles = StyleSheet.create({
  navigator: {
    flex: 1,
    backgroundColor: '#000000',
  },
  navigationBar: {
    backgroundColor: '#319EFF',
  },
  navigatorTitle: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
    marginTop: 10,
  },
  navigationButton: {
    padding: 10,
  },
  navigationLeftButton: {
    paddingLeft: 20,
    paddingRight: 40,
  },
});

const routes = [
  { name: 'login', title: '登入', index: 0 },
  { name: 'flowerPrediction', title: '花種辨認', index: 1 },
];

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

  static rednerNavigationBar() {
    return (
      <Navigator.NavigationBar
        style={styles.navigationBar}
        routeMapper={{
          LeftButton: (route, navigator, index) => {
            if (index === 0) return null;
            return (
              <TouchableOpacity
                style={[styles.navigationButton, styles.navigationLeftButton]}
                onPress={() => navigator.pop()}
              >
                <Text style={{ color: 'white' }}>返回</Text>
              </TouchableOpacity>
            );
          },
          RightButton: () => null,
          Title: route => (
            <Text style={styles.navigatorTitle}>
              {route.title}
            </Text>
          ),
        }}
      />
    );
  }

  render() {
    return (
      <Navigator
        initialRoute={routes[1]}
        initialRouteStack={routes}
        navigationBar={AppNavigator.rednerNavigationBar()}
        renderScene={AppNavigator.renderScene}
        configureScene={AppNavigator.configureScene}
        style={styles.navigator}
      />
    );
  }
}

export default AppNavigator;
