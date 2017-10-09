import React, { PureComponent } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Snackbar } from './common';
import AppNavigator from './AppNavigator';
import LoginView from './views/LoginView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  loggedIn: boolean;
  apiErrorMessage?: string;
}

class App extends PureComponent {
  static defaultProps = {
    apiErrorMessage: null,
  }

  props: Props

  render() {
    const { loggedIn, apiErrorMessage } = this.props;

    if (!loggedIn) {
      return <LoginView />;
    }

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="black"
          barStyle="dark-content"
        />

        <Snackbar
          show={!!apiErrorMessage}
          message={apiErrorMessage}
        />

        <AppNavigator />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
  apiErrorMessage: get(state.api, 'error.message'),
});

export default connect(mapStateToProps)(App);
