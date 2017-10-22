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
  setImagePreview: (uri: string) => void;
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
    const { removeImagePreview } = this.props;
    removeImagePreview();
  }

  onTookPhoto = async (uri) => {
    const { setImagePreview, navigator } = this.props;
    const resizedImage = await resizeImage(uri);
    setImagePreview(resizedImage.originalUri);
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
  setImagePreview(uri) {
    dispatch(uiAction.setImagePreview(uri));
  },
  removeImagePreview() {
    dispatch(uiAction.removeImagePreview());
  },
});

export default connect(null, mapDispatchToProps)(CameraView);
