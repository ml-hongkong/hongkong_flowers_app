// @flow

import React, { PureComponent } from 'react';
import { ImageBackground, ImageEditor, Image, View, StyleSheet, Dimensions } from 'react-native';
import Camera from 'react-native-camera';
import { resizeImage } from '../lib/resizeImage';
import CameraToolBar from './CameraToolBar';
import TakePhotoButton from './TakePhotoButton';

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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
      const image = await this.camera.capture({ metadata: options });
      const resizedImage = await resizeImage(image);
      onTookPhoto(resizedImage);
    } catch (error) {
      throw error;
    }
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <Camera
          ref={(camera) => {
            this.camera = camera;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.temp}
        />
        <ImageBackground
          style={styles.overlay}
          source={require('./img/camera_bg.png')}
          resizeMode="cover"
          pointerEvents={false}
        />
        <CameraToolBar>
          <TakePhotoButton
            onPress={this.handleTakePhoto}
            style={styles.takePhotoButton}
          />
        </CameraToolBar>
      </View>
    );
  }
}

export default CustomCamera;
