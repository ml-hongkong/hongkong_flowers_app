// @flow

import React, { PureComponent } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { FBLoginButton } from '../../common';

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
    marginTop: -150,
  },
  logoTitle: {
    fontSize: 28,
    color: '#777',
  },
  buttonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
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
      <ImageBackground
        style={styles.container}
        source={require('../../common/img/auth_bg.jpg')}
      >
        <View style={styles.logo}>
          <Image
            source={require('../../common/img/auth_logo.png')}
            style={styles.image}
          />
          <Text style={styles.logoTitle}>香港野花</Text>
        </View>
        <View style={styles.buttonContainer}>
          <FBLoginButton onLoggedIn={this.onLoggedIn} />
          <Text style={styles.terms}>按登入後即表示你同意並接受本條款及細則</Text>
        </View>
      </ImageBackground>
    );
  }
}

export default connect()(LoginView);
