// @flow

import React, { PureComponent } from 'react';
import { Animated, Platform, TouchableOpacity, View, Dimensions, ImageBackground, Image, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import * as predictAction from '../actions/prediction';
import { Spinner, Geolocation, imageUriToBase64 } from '../common';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}

const previewViewSize = 300;
const entryBorderRadius = 8;
const previewInitialTop = (screenHeight - previewViewSize - 12) * 0.5;
const previewInitialLeft = (screenWidth - previewViewSize - 12) * 0.5;
const slideWidth = wp(75);
const slideHeight = screenHeight * 0.5;
const sliderWidth = screenWidth;
const itemHorizontalMargin = wp(2);
const itemWidth = slideWidth + (itemHorizontalMargin * 2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  predictionInfo: {
    position: 'absolute',
    width: '100%',
    top: '20%',
    alignItems: 'center',
  },
  name: {
    fontSize: 46,
    color: '#fff',
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
  paginationContainer: {
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  slideHeader: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  slideContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    width: sliderWidth,
  },
  slideItem: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  slideOuterContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  slideInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 18, // needed for shadow
  },
  slideTextContainer: {
    justifyContent: 'center',
    paddingTop: 20 - 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  slideImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: Platform.OS === 'ios' ? 8 : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  slideTitle: {
    color: 'black',
    fontSize: 22,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  slideTitle2: {
    color: '#333',
    fontSize: 12,
    marginBottom: 5,
  },
  slideSpecies: {
    color: '#333',
    fontSize: 12,
    marginBottom: 5,
  },
  slideType: {
    color: '#333',
    fontSize: 12,
  },
  slidePreviewImage: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
});

type Props = {
  fetchFlowerPrediction: ({
    image: string;
    lat: number;
    lng: number;
  }) => void;
  imagePreview?: {
    uri: string;
  };
  waitingForPrediction: boolean;
  predictions?: [];
}

type Item = {
  item: {
    prop: number,
    chineseName2: string;
    type: string,
    species: string,
    previewUrl: string,
    title: string
  }
}
const CarouselItem = ({ item }: Item, parallaxProps: Object) => (
  <TouchableOpacity
    activeOpacity={1}
    style={styles.slideInnerContainer}
    onPress={() => { console.log(`You've clicked '${item.title}'`); }}
  >
    <View style={styles.slideItem}>
      <ParallaxImage
        containerStyle={styles.slidePreviewImage}
        style={[styles.slideImage, { position: 'relative' }]}
        source={{ uri: item.previewUrl }}
        parallaxFactor={0.35}
        showSpinner
        spinnerColor={'rgba(255, 255, 255, 0.4)'}
        {...parallaxProps}
      />
    </View>
    <View style={styles.slideTextContainer}>
      <Text style={styles.slideTitle}>
        { `${item.chineseName}(${(item.prob * 100).toFixed(2)}%)` }
      </Text>
      {
        item.chineseName2 ? (
          <Text style={styles.slideTitle2}>
            { `別名: ${item.chineseName2}` }
          </Text>
        ) : null
      }
      <Text style={styles.slideSpecies}>
        { `品種: ${item.species}`
        }</Text>
      <Text style={styles.slideType}>
        { `習性: ${item.type}` }
      </Text>
    </View>
  </TouchableOpacity>
);

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
    const { imagePreview, fetchFlowerPrediction } = this.props;

    if (!this.state.isPredicted && imagePreview) {
      const { latitude: lat, longitude: lng } = position.coords;
      try {
        const image = await imageUriToBase64(imagePreview.uri);
        fetchFlowerPrediction({
          image,
          lat,
          lng,
        });
        this.setState({ isPredicted: true });
      } catch (error) {
        throw error;
      }
    }
  }

  props: Props;

  renderCarousel() {
    const { predictions } = this.props;
    const { sliderActiveSlide } = this.state;

    if (!predictions.length) {
      return null;
    }

    return (
      <View style={styles.slideOuterContainer}>
        <View style={styles.slideContainer}>
          <Text style={styles.slideHeader}>
            找到幾種最相似:
          </Text>
          <Carousel
            ref={(c) => { this.carousel = c; }}
            data={predictions}
            hasParallaxImages
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            enableMomentum={false}
            firstItem={0}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={index => this.setState({ sliderActiveSlide: index })}
            renderItem={CarouselItem}
          />
          <Pagination
            dotsLength={predictions.length}
            activeDotIndex={sliderActiveSlide}
            containerStyle={styles.paginationContainer}
            dotColor={'rgba(255, 255, 255, 0.92)'}
            dotStyle={styles.paginationDot}
            inactiveDotColor={'black'}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={this.carousel}
            tappableDots={!!this.carousel}
          />
        </View>
      </View>
    );
  }

  render() {
    const { waitingForPrediction, imagePreview } = this.props;
    const { preivewTopAnim } = this.state;

    if (!imagePreview) {
      return null;
    }

    return (
      <ImageBackground
        style={styles.container}
        source={require('../common/img/auth_bg.jpg')}
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

        {this.renderCarousel()}

        <Spinner show={waitingForPrediction} />
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => ({
  waitingForPrediction: state.prediction.pending,
  predictions: state.prediction.predictions,
  imagePreview: state.ui.imagePreview,
});

const mapDispatchToProps = dispatch => ({
  fetchFlowerPrediction({ ...args }) {
    dispatch(predictAction.fetchFlowerPrediction(args));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PreviewView);
