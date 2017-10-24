// @flow

import React, { PureComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Camera, resizeImage } from '../../common';
import * as uiAction from '../../actions/ui';
import { routes } from '../../AppNavigator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  updateImagePreview: (uri?: string) => void;
  navigator: Object;
}

class CameraView extends PureComponent {
  static defaultProps = {
    updateImagePreview: () => {},
  }

  componentDidMount() {
    // remove preview image
    const { updateImagePreview } = this.props;
    updateImagePreview();
  }

  onTookPhoto = async (uri) => {
    const { updateImagePreview, navigator } = this.props;
    const resizedImage = await resizeImage(uri);
    updateImagePreview(resizedImage.originalUri);
    navigator.push(routes[1]);
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
  updateImagePreview(uri?: string) {
    dispatch(uiAction.updateImagePreview(uri));
  },
});

export default connect(null, mapDispatchToProps)(CameraView);
