// @flow

import React, { PureComponent } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const toolbarHeight = 100;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: toolbarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    opacity: 0.5,
    height: toolbarHeight,
    backgroundColor: '#000',
  },
});

type Props = {
  children: any;
}

export default class CameraToolBar extends PureComponent {
  props: Props

  render() {
    const width = Dimensions.get('window').width;
    const { children } = this.props;

    return (
      <View style={[styles.container, { width }]}>
        <View style={[styles.overlay, { width }]} />
        {children}
      </View>
    );
  }
}
