import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Toolbar, FBLoginButton } from '../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    color: '#000',
    textAlign: 'center',
  },
});

// eslint-disable-next-line
const closeIcon = require('../common/img/x-white.png');

type Props = {
  navigator: Object;
}

class LoginModal extends PureComponent {
  onLoggedIn = () => {
    setTimeout(this.dismiss, 2000);
  }

  props: Props;

  dismiss = () => {
    const { navigator } = this.props;
    navigator.pop();
  }

  render() {
    const rightItem = {
      title: 'close',
      layout: 'icon',
      icon: closeIcon,
      onPress: this.dismiss,
    };

    return (
      <View style={styles.container}>
        <Toolbar
          rightItem={rightItem}
        />
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>
              you're not logged in{'\n'}
            </Text>

            <FBLoginButton onLoggedIn={this.onLoggedIn} />
          </View>
        </View>
      </View>
    );
  }
}

export default connect()(LoginModal);
