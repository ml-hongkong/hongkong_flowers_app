// @flow

import React, { PureComponent } from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';
import RNSpinner from 'react-native-spinkit';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SHOW_ANIMATION_DURACTION = 0;
const DISMISS_ANIMATION_DURACTION = 500;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
  },
  spinner: {
    color: '#fff',
  },
});

type Props = {
  show?: bool;
}

export default class Spinner extends PureComponent {
  static defaultProps = {
    show: false,
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  componentWillMount() {
    if (this.props.show) {
      this.show();
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.show !== nextProps.show) {
      if (nextProps.show) {
        this.show();
        return;
      }
      this.dismiss();
    }
  }

  props: Props;

  show = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: SHOW_ANIMATION_DURACTION,
      useNativeDriver: true,
    }).start();
  }

  dismiss = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: DISMISS_ANIMATION_DURACTION,
      useNativeDriver: true,
    }).start();
  }

  render() {
    return (
      <Animated.View
        pointerEvents="none"
        style={StyleSheet.flatten([styles.container, { opacity: this.state.opacity }])}
      >
        <RNSpinner
          style={styles.spinner}
          size={100}
          type="Arc"
        />
      </Animated.View>
    );
  }
}
