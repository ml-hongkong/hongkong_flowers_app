// @flow

import React, { PureComponent } from 'react';
import { ImageBackground, StyleSheet, Dimensions } from 'react-native';
import Camera from 'react-native-camera';
import CameraToolBar from './CameraToolBar';
import TakePhotoButton from './TakePhotoButton';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: undefined,
    height: undefined,
    backgroundColor: 'transparent',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  currentImage: {
    width: screenWidth,
    height: null,
  },
  takePhotoButton: {
    opacity: 0.8,
  },
});

type Props = {
  onTookPhoto?: (imageURL: string) => void;
}

class CustomCamera extends PureComponent {
  static defaultProps = {
    onTookPhoto: () => {},
  }

  props: Props

  handleTakePhoto = async () => {
    const { onTookPhoto } = this.props;
    const options = {};
    try {
      const { path } = await this.camera.capture({ metadata: options });
      onTookPhoto(path);
    } catch (error) {
      throw error;
    }
  }

  render() {
    return (
      <ImageBackground
        style={styles.container}
        source={require('./img/camera_bg.png')}
      >
        <Camera
          ref={(camera) => {
            this.camera = camera;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.temp}
          defaultTouchToFocus
        />

        <CameraToolBar>
          <TakePhotoButton
            onPress={this.handleTakePhoto}
            style={styles.takePhotoButton}
          />
        </CameraToolBar>
      </ImageBackground>
    );
  }
}

export default CustomCamera;
