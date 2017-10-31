// @flow

import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import SnapCarousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import Browser from 'react-native-browser';
import { RoundButton } from 'react-native-button-component';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
function wp(percentage) {
  const value = (percentage * screenWidth) / 100;
  return Math.round(value);
}

const entryBorderRadius = 8;
const slideWidth = wp(75);
const slideHeight = screenHeight * 0.6;
const sliderWidth = screenWidth;
const itemHorizontalMargin = wp(2);
const itemWidth = slideWidth + (itemHorizontalMargin * 2);

const styles = StyleSheet.create({
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
  slideReportContainer: {
    paddingTop: 20 - 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
  },
  slideReportHeader: {
    fontSize: 24,
    color: '#999',
    marginTop: 8,
    marginBottom: 12,
  },
  slideReportParagraph: {
    fontSize: 16,
    marginBottom: 26,
  },
  slideReportButtonText: {
    fontSize: 16,
    letterSpacing: 1,
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

type Item = {
  item: {
    prob: number,
    chineseName: string,
    chineseName2: string,
    type: string,
    species: string,
    previewUrl: string,
    pageUrl: string,
  }
}

type Props = {
  sliderActiveSlide?: number,
  predictions: Array<Item>,
  onReport: ?() => void,
}

const CarouselItem = ({ item }: ?Item, parallaxProps: Object, onReport: ?() => void) => (
  item.prob ? (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.slideInnerContainer}
      onPress={() => {
        const url = item.pageUrl;
        Browser.open(url, {
          showPageTitles: true,
          showUrlWhileLoading: true,
        });
      }}
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
  ) : (
    <View style={styles.slideReportContainer}>
      <Text style={styles.slideReportHeader}>找不到?</Text>
      <Text style={styles.slideReportParagraph}>這花好可能是未有收錄到我們資料庫，你想加這花到資料庫嗎?</Text>
      <RoundButton
        text="加到資料庫"
        textStyle={styles.slideReportButtonText}
        backgroundColors={['#1689CE', '#1B9CE2']}
        onPress={() => {
          onReport();
        }}
      />
    </View>
  )
);

class Carousel extends Component {
  static defaultProps = {
    sliderActiveSlide: 0,
    onReport: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      sliderActiveSlide: props.sliderActiveSlide,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.sliderActiveSlide !== nextProps.sliderActiveSlide) {
      this.goToItem(nextProps.sliderActiveSlide);
    }
  }

  props: Props

  goToItem = (sliderActiveSlide) => {
    this.setState({ sliderActiveSlide });
  }

  render() {
    const { predictions } = this.props;
    const carouselData = predictions.concat([{}]); // appends empty item for reporting slide
    const renderItem = (slideProps: ?Item, parallaxProps: Object) =>
      CarouselItem(slideProps, parallaxProps, this.props.onReport);

    return (
      <View style={styles.slideOuterContainer}>
        <View style={styles.slideContainer}>
          <Text style={styles.slideHeader}>
            找到幾種最相似:
          </Text>
          <SnapCarousel
            ref={(carousel) => { this.carousel = carousel; }}
            data={carouselData}
            hasParallaxImages
            inactiveSlideScale={0.94}
            inactiveSlideOpacity={0.7}
            enableMomentum={false}
            firstItem={0}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            onSnapToItem={this.goToItem}
            renderItem={renderItem}
          />
          <Pagination
            dotsLength={carouselData.length}
            activeDotIndex={this.state.sliderActiveSlide}
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
}

export default Carousel;
