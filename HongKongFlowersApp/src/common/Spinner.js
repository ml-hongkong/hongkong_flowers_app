// @flow

import React, { PureComponent } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
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
    show: true,
  }

  constructor(props: Props) {
    super(props);

    const initValue = props.show ? 1 : 0;
    this.state = {
      show: props.show,
      opacity: new Animated.Value(initValue),
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.show !== nextProps.show) {
      let toValue = 0;
      let duration = DISMISS_ANIMATION_DURACTION;
      if (nextProps.show) {
        toValue = 1;
        duration = SHOW_ANIMATION_DURACTION;
      }

      Animated.timing(this.state.opacity, {
        toValue,
        duration,
        useNativeDriver: true,
      })
        .start(() => {
          this.setState({ show: nextProps.show });
        });
    }
  }

  props: Props;

  render() {
    return (
      <View
        pointerEvents="none"
        style={styles.container}
      >
        <Animated.View style={{ opacity: this.state.opacity }}>
          <RNSpinner
            style={styles.spinner}
            size={100}
            type="Arc"
          />
        </Animated.View>
      </View>
    );
  }
}
