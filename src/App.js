import React, { PureComponent } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import AppNavigator from './AppNavigator';
import LoginView from './views/LoginView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  loggedIn: boolean;
}

class App extends PureComponent {
  props: Props

  render() {
    const { loggedIn } = this.props;

    if (!loggedIn) {
      return <LoginView />;
    }

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="black"
          barStyle="dark-content"
        />
        <AppNavigator />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
});

export default connect(mapStateToProps)(App);
