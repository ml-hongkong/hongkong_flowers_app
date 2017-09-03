// @flow

import React, { PureComponent, Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Camera from 'react-native-camera';
import CameraToolBar from './CameraToolBar';
import TakePhotoButton from './TakePhotoButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  currentImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
  },
  buttonText: {
    color: '#fff',
    opacity: 0.8,
    backgroundColor: 'transparent',
    padding: 10,
  },
  takePhotoButton: {
    opacity: 0.8,
  },
});

type Props = {
  onTookPhoto?: () => void;
}

class CustomCamera extends PureComponent {
  static defaultProps = {
    onTookPhoto: () => {},
  }

  state = {
    currentImage: null,
  }

  props: Props

  handleTakePhoto = async () => {
    const { onTookPhoto } = this.props;
    const { currentImage } = this.state;

    if (currentImage) {
      return;
    }

    const options = {};
    try {
      const image = await this.camera.capture({ metadata: options });
      this.setState({ currentImage: image });
      onTookPhoto(image);
    } catch (error) {
      // TODO handle error
    }
  }

  handleSubmitPhoto = () => {
  }

  handleCancel = () => {
    this.setState({ currentImage: null });
  }

  render() {
    const { currentImage } = this.state;

    let previewCurrentImage;
    let takePhotoButtonTitle;
    if (currentImage) {
      previewCurrentImage = (
        <Image
          style={styles.currentImage}
          source={{ uri: currentImage.path }}
        />
      );
      takePhotoButtonTitle = previewCurrentImage ? 'SEARCH' : null;
    }

    return (
      <View style={styles.container}>
        <Camera
          ref={(camera) => {
            this.camera = camera;
          }}
          captureTarget={Camera.constants.CaptureTarget.disk}
          defaultTouchToFocus
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
        />

        {previewCurrentImage}

        <CameraToolBar>
          <TouchableOpacity
            onPress={this.handleCancel}
            activeOpacity={0.5}
          >
            <Text style={styles.buttonText}>
              CANCEL
            </Text>
          </TouchableOpacity>

          <TakePhotoButton
            onPress={previewCurrentImage ? this.handleSubmitPhoto : this.handleTakePhoto}
            style={styles.takePhotoButton}
            title={takePhotoButtonTitle}
          />

          <TouchableOpacity
            onPress={this.handleDone}
            activeOpacity={0.5}
          >
            <Text style={styles.buttonText}>
              DONE
            </Text>
          </TouchableOpacity>
        </CameraToolBar>
      </View>
    );
  }
}

export default CustomCamera;
