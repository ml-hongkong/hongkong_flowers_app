// @flow

import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { FBLoginButton } from '../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
  },
});

class LoginView extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          flower.ai
        </Text>
        <FBLoginButton onLoggedIn={this.onLoggedIn} />
      </View>
    );
  }
}

export default connect()(LoginView);
