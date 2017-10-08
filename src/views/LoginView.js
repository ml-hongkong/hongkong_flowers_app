// @flow

import React, { PureComponent } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { FBLoginButton } from '../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent',
  },
  image: {
    width: 200,
    height: 200,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: -200,
  },
  logoTitle: {
    fontSize: 28,
    color: '#777',
  },
  buttonContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    width: '100%',
    position: 'absolute',
    bottom: 40,
  },
  terms: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 22,
  },
});

class LoginView extends PureComponent {
  render() {
    return (
      <Image
        style={styles.container}
        source={require('../../assets/auth_bg.jpg')}
      >
        <View style={styles.logo}>
          <Image
            source={require('../../assets/auth_logo.png')}
            style={styles.image}
          />
          <Text style={styles.logoTitle}>香港野花</Text>
        </View>
        <View style={styles.buttonContainer}>
          <FBLoginButton onLoggedIn={this.onLoggedIn} />
          <Text style={styles.terms}>按登入後即表示你同意並接受本條款及細則</Text>
        </View>
      </Image>
    );
  }
}

export default connect()(LoginView);
