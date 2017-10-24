// @flow

import React, { PureComponent } from 'react';
import { Animated, Dimensions, ImageBackground, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Carousel from './Carousel';
import * as predictAction from '../../actions/prediction';
import { Spinner, Geolocation, imageUriToBase64 } from '../../common';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const previewViewSize = 300;
const previewInitialTop = (screenHeight - previewViewSize - 12) * 0.5;
const previewInitialLeft = (screenWidth - previewViewSize - 12) * 0.5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  predictions: {
    color: '#fff',
    fontSize: 18,
  },
  preview: {
    position: 'absolute',
    left: previewInitialLeft,
    borderWidth: 6,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#002A87',
    backgroundColor: 'white',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderRadius: 3,
  },
  previewImage: {
    width: 300,
    height: 300,
  },
});

type Props = {
  fetchFlowerPrediction: ({
    image: string,
    lat: number,
    lng: number,
    userId: string,
  }) => void;
  imagePreview?: {
    uri: string,
  };
  userId: string,
  waitingForPrediction: boolean,
  predictions?: [],
}

class PreviewView extends PureComponent {
  static defaultProps = {
    predictions: [],
    errorMessage: null,
    imagePreview: null,
  }

  state = {
    sliderActiveSlide: 0,
    preivewTopAnim: new Animated.Value(previewInitialTop),
    isPredicted: false,
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.predictions.length !== nextProps.predictions.length) {
      Animated.timing(this.state.preivewTopAnim, {
        toValue: previewInitialTop - 100,
        duration: 1000,
        // useNativeDriver: true,
      }).start();
    }
  }

  onPositionUpdated = async (position) => {
    const { userId, imagePreview, fetchFlowerPrediction } = this.props;

    if (!this.state.isPredicted && imagePreview) {
      const { latitude: lat, longitude: lng } = position.coords;
      try {
        const image = await imageUriToBase64(imagePreview.uri);
        fetchFlowerPrediction({
          image,
          lat,
          lng,
          userId,
        });
        this.setState({ isPredicted: true });
      } catch (error) {
        throw error;
      }
    }
  }

  props: Props;

  render() {
    const { waitingForPrediction, imagePreview, predictions } = this.props;
    const { preivewTopAnim } = this.state;

    if (!imagePreview) {
      return null;
    }

    const carousel = predictions ? (
      <Carousel predictions={predictions} />
    ) : null;

    return (
      <ImageBackground
        style={styles.container}
        source={require('../../common/img/auth_bg.jpg')}
      >
        <Geolocation
          onPositionUpdated={this.onPositionUpdated}
        />

        <Animated.View style={
          StyleSheet.flatten([styles.preview, { top: preivewTopAnim }])}
        >
          <Image
            style={styles.previewImage}
            source={{ uri: imagePreview.uri }}
          />
        </Animated.View>

        {carousel}

        <Spinner show={waitingForPrediction} />
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  waitingForPrediction: state.prediction.pending,
  predictions: state.prediction.predictions,
  imagePreview: state.ui.imagePreview,
  userId: state.auth.userId,
});

const mapDispatchToProps = dispatch => ({
  fetchFlowerPrediction({ ...args }) {
    dispatch(predictAction.fetchFlowerPrediction(args));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewView);
