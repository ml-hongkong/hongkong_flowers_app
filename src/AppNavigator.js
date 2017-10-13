import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import LoginModal from './login/LoginModal';
import { logout } from './actions/auth';
import CameraView from './views/CameraView';
import PreviewView from './views/PreviewView';

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
  navigationButtonText: {
    color: 'white',
  },
  navigationLeftButton: {
    paddingLeft: 20,
    paddingRight: 40,
  },
});

export const routes = [
  { name: 'camera', title: '香港野花', index: 0, hideNav: false },
  { name: 'preview', title: '香港野花', index: 1, hideNav: false },
  // In case the auth session expired or unauthenticated api request
  // { name: 'login', title: '登入', index: 1, hideNav: true },
];

type Props = {
  logout?: () => void;
}

class AppNavigator extends PureComponent {
  static defaultProps = {
    logout: () => {},
  }

  static configureScene(route) {
    if (route.name === 'login') {
      return Navigator.SceneConfigs.FloatFromBottom;
    }
    if (route.name === 'camera') {
      return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
    }
    if (route.name === 'preview') {
      return Navigator.SceneConfigs.FloatFromBottom;
    }
    return Navigator.SceneConfigs.FloatFromRight;
  }

  static renderScene(route, navigator) {
    if (route.name === 'login') {
      return <LoginModal navigator={navigator} />;
    }
    if (route.name === 'camera') {
      return <CameraView navigator={navigator} />;
    }
    if (route.name === 'preview') {
      return <PreviewView navigator={navigator} />;
    }
    return <CameraView navigator={navigator} />;
  }

  static rednerNavigationBar({ handleLogout }) {
    return (
      <Navigator.NavigationBar
        style={styles.navigationBar}
        routeMapper={{
          LeftButton: (route, navigator, index) => {
            if (route.hideNav) return null;

            if (index === 0) {
              return (
                <TouchableOpacity
                  style={[styles.navigationButton, styles.navigationLeftButton]}
                  onPress={() => handleLogout()}
                >
                  <Text style={styles.navigationButtonText}>登出</Text>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                style={[styles.navigationButton, styles.navigationLeftButton]}
                onPress={() => navigator.pop()}
              >
                <Text style={styles.navigationButtonText}>返回</Text>
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

  props: Props

  render() {
    return (
      <Navigator
        initialRoute={routes[0]}
        initialRouteStack={routes}
        navigationBar={AppNavigator.rednerNavigationBar({ handleLogout: this.props.logout })}
        renderScene={AppNavigator.renderScene}
        configureScene={AppNavigator.configureScene}
        style={styles.navigator}
      />
    );
  }
}

const mapStateToProps = state => ({ state });

const mapDispatchToProps = dispatch => ({
  logout: () =>
    dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
