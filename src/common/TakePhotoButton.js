// @flow

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const buttonSize = 70;
const circleSize = buttonSize - 15;

const styles = StyleSheet.create({
  container: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: '#fff',
  },
});

type Props = {
  onPress: () => void;
  style?: any;
}

export default function TakePhotoButton({ onPress, style }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.4}
      onPress={onPress}
    >
      <View style={styles.circle} />
    </TouchableOpacity>
  );
}

TakePhotoButton.defaultProps = {
  style: null,
  title: null,
};
