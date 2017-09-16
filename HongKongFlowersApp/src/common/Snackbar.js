// @flow

import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const INITIAL_POSITION = -180;
const DEFAULT_ANIMATION_DURATION = 500;

const styles = StyleSheet.create({
  snackbar: {
    flex: 1,
    position: 'absolute',
    top: INITIAL_POSITION,
    zIndex: 1000,
    paddingTop: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#361C39',
    opacity: 0.8,
  },
  content: {

  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonTitle: {
    color: '#52A5E8',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  inlineText: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#fff',
  },
  inlineRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // padding: 18,
  },
});

type Props = {
  duration?: number;
  show?: bool;
  message?: any;
}

class Snackbar extends PureComponent {
  static defaultProps = {
    duration: DEFAULT_ANIMATION_DURATION,
    show: false,
    message: null,
  }

  constructor(props) {
    super(props);

    const initValue = props.show ? -INITIAL_POSITION : INITIAL_POSITION;
    this.state = {
      transformOffsetY: new Animated.Value(initValue),
    };
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

  props: Props

  show = () => {
    const { duration } = this.props;
    Animated.timing(this.state.transformOffsetY, {
      toValue: -INITIAL_POSITION,
      duration,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    })
      .start();
  }

  dismiss = () => {
    const { duration } = this.props;
    Animated.timing(this.state.transformOffsetY, {
      toValue: INITIAL_POSITION,
      duration,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.quad),
    })
      .start();
  }

  render() {
    const { message } = this.props;

    return (
      <Animated.View
        style={[
          styles.snackbar,
          { width: screenWidth },
          { transform: [{ translateY: this.state.transformOffsetY }] },
        ]}
      >
        <View style={styles.inlineRow} >
          <Text style={styles.inlineText}>
            {message}
          </Text>

          <TouchableOpacity
            onPress={this.dismiss}
            style={styles.buttonContainer}
          >
            <Text style={styles.buttonTitle}>
              DISMISS
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
}

export default Snackbar;
