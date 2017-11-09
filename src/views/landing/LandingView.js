// @flow

import React, { PureComponent } from 'react';
import { Text, Linking, Image, ImageBackground, StyleSheet } from 'react-native';
import { RoundButton } from 'react-native-button-component';
import { routes } from '../../AppNavigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    letterSpacing: 1,
  },
  button: {},
  introduction: {
    fontSize: 16,
    color: '#333',
    width: '80%',
    lineHeight: 32,
    marginBottom: 16,
  },
  logo: {
    marginBottom: 16,
  },
  hyperlink: {
    color: '#319EFF',
    fontWeight: 'bold',
  },
});

type Props = {
  navigator: Object;
}

class LandingView extends PureComponent {
  constructor(props) {
    super(props);

    this.handleOnPress = this.handleOnPress.bind(this);
  }

  handleOnPress() {
    this.props.navigator.push(routes[1]);
  }

  props: Props

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={require('../../common/img/auth_bg.jpg')}
      >
        <Image
          style={styles.logo}
          source={require('../../common/img/landing_logo.png')}
        />
        <Text style={styles.introduction}>
          這是由本地的植物愛好團體
          <Text
            style={styles.hyperlink}
            onPress={() => { Linking.openURL('http://hkcww.org/hkplant/main.htm'); }}
          >
            (柴娃娃植物網)
          </Text>
          及人工智能愛好團體共同開發的 APP,
          我們搜集了 165 種本地常見野花, 希望透過這 APP 令大家認識身邊美麗的植物。
        </Text>
        <RoundButton
          textStyle={styles.buttonText}
          buttonStyle={styles.button}
          height={44}
          width={320}
          onPress={this.handleOnPress}
          backgroundColors={['#1689CE', '#1B9CE2']}
          text="開始"
        />
      </ImageBackground>
    );
  }
}

export default LandingView;
