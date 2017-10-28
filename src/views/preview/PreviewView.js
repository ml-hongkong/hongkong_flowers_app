// @flow

import React, { PureComponent } from 'react';
import { Alert, Animated, Dimensions, ImageBackground, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Carousel from './Carousel';
import * as predictAction from '../../actions/prediction';
import * as reportAction from '../../actions/report';
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
  reportEntity: (entityId: string) => void;
  cleanReport: () => void;
  imagePreview?: {
    uri: string,
  };
  entityId?: string;
  userId: string;
  waitingForPrediction: boolean;
  waitingForReport: boolean;
  isReportSuccess: boolean;
  predictions?: [];
  navigator: Object;
}

class PreviewView extends PureComponent {
  static defaultProps = {
    predictions: [],
    entityId: null,
    errorMessage: null,
    imagePreview: null,
  }

  state = {
    sliderActiveSlide: 0,
    preivewTopAnim: new Animated.Value(previewInitialTop),
    isPredicted: false,
    isPreviewTopUpdated: false,
  }

  componentWillMount() {
    // clean report state
    this.props.cleanReport();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.isPreviewTopUpdated && nextProps.predictions.length > 0
      && !nextProps.waitingForPrediction) {
      Animated.timing(this.state.preivewTopAnim, {
        toValue: previewInitialTop - 100,
        duration: 1000,
        // useNativeDriver: true,
      }).start();
      this.setState({ isPreviewTopUpdated: true });
    } else {
      // reset preview picture top
      this.setState({ preivewTopAnim: new Animated.Value(previewInitialTop) });
    }

    // if use reported the flower and got response
    if (this.state.isPredicted && !nextProps.waitingForReport && nextProps.isReportSuccess) {
      Alert.alert('我們將會處理', '感謝你的參與，令我們的資料庫更完善!', [{
        text: 'OK',
        onPress: () => {
          this.props.navigator.pop();
        },
      }]);
    }
  }

  handlePositionUpdated = async (position) => {
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

  handleReport = () => {
    const { entityId, reportEntity } = this.props;

    try {
      reportEntity(entityId);
    } catch (error) {
      throw error;
    }
  }

  props: Props;

  render() {
    const { waitingForPrediction, waitingForReport, imagePreview, predictions } = this.props;
    const { preivewTopAnim } = this.state;

    if (!imagePreview.uri) {
      return null;
    }

    const carousel = predictions.length ? (
      <Carousel predictions={predictions} onReport={this.handleReport} />
    ) : null;

    return (
      <ImageBackground
        style={styles.container}
        source={require('../../common/img/auth_bg.jpg')}
      >
        <Geolocation
          onPositionUpdated={this.handlePositionUpdated}
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

        <Spinner show={waitingForPrediction || waitingForReport} />
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  waitingForPrediction: state.prediction.pending,
  waitingForReport: state.report.pending,
  isReportSuccess: state.report.success,
  predictions: state.prediction.predictions,
  entityId: state.prediction.entityId,
  imagePreview: state.ui.imagePreview,
  userId: state.auth.userId,
});

const mapDispatchToProps = dispatch => ({
  fetchFlowerPrediction({ ...args }) {
    dispatch(predictAction.fetchFlowerPrediction(args));
  },
  reportEntity(entityId) {
    dispatch(reportAction.reportEntity(entityId));
  },
  cleanReport() {
    dispatch(reportAction.cleanReport());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewView);
