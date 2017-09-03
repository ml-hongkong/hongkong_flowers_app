// @flow

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const buttonSize = 60;
const circleSize = buttonSize - 10;

const styles = StyleSheet.create({
  container: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderWidth: 2,
    borderRadius: circleSize / 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
});

type Props = {
  onPress: () => void;
  style?: any;
  title?: any;
}

export default function TakePhotoButton({ onPress, style, title }: Props) {
  const content = title ? (
    <Text>{title}</Text>
  ) : (
    <View style={styles.circle} />
  );

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.4}
      onPress={onPress}
    >
      {content}
    </TouchableOpacity>
  );
}

TakePhotoButton.defaultProps = {
  style: null,
  title: null,
};
