// @flow

import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { RoundButton } from 'react-native-button-component';
import * as authActions from '../actions/auth';

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    letterSpacing: 1,
  },
  button: {
    padding: 0,
  },
});

class FBLoginButton extends PureComponent {
  static defaultProps = {
    onLoggedIn: () => {},
  }

  state = {
    buttonStatus: 'login',
    buttonStates: {
      login: {
        text: 'Facebook 登入',
        onPress: () => this.handleLogin(),
      },
      signingIn: {
        spinner: true,
        text: '登入中...',
      },
    },
  }

  props: {
    onLoggedIn?: () => void;
    loginWithFacebook: (accessToken: string) => void;
  }

  handleLogin = async () => {
    const { loginWithFacebook, onLoggedIn } = this.props;
    this.setState({ buttonStatus: 'signingIn' });

    try {
      const loginResult = await LoginManager.logInWithReadPermissions(['public_profile']);
      if (loginResult.isCancelled) {
        throw Error('Error: User cancelled login');
      }

      const accessToken = await AccessToken.getCurrentAccessToken();

      if (!accessToken) {
        throw Error('Error: No access token');
      }

      loginWithFacebook(accessToken.accessToken);
      onLoggedIn();
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        this.setState({ buttonStatus: 'login' });
      }, 1000);
    }
  }

  render() {
    return (
      <RoundButton
        buttonState={this.state.buttonStatus}
        states={this.state.buttonStates}
        textStyle={styles.text}
        buttonStyle={styles.button}
        image={require('./img/facebook_icon.png')}
        backgroundColors={['#1689CE', '#1B9CE2']}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginWithFacebook: (accessToken) => {
    dispatch(authActions.loginWithFacebook(accessToken));
  },
});

export default connect(null, mapDispatchToProps)(FBLoginButton);
