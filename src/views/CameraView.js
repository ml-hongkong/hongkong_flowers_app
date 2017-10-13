// @flow

import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Camera } from '../common';
import * as uiAction from '../actions/ui';
import { routes } from '../AppNavigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  setImagePreview: ({
    path: string;
    uri: string;
  }) => void;
  navigator: Object;
  removeImagePreview: () => void;
}

class CameraView extends PureComponent {
  static defaultProps = {
    setImagePreview: () => {},
    removeImagePreview: () => {},
  }

  componentDidMount() {
    // remove preview image
    this.props.removeImagePreview();
  }

  onTookPhoto = (image) => {
    this.props.setImagePreview(image);
    this.props.navigator.push(routes[1]);
  }

  props: Props

  render() {
    return (
      <View style={styles.container}>
        <Camera onTookPhoto={this.onTookPhoto} />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setImagePreview({ ...args }) {
    dispatch(uiAction.setImagePreview(args));
  },
  removeImagePreview({ ...args }) {
    dispatch(uiAction.removeImagePreview(args));
  },
});

export default connect(null, mapDispatchToProps)(CameraView);
