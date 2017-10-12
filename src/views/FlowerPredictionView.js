// @flow

import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as predictAction from '../actions/prediction';
import { Camera, Spinner, Geolocation } from '../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

type Props = {
  fetchFlowerPrediction: ({
    imageURL: string;
    lat: number;
    lng: number;
  }) => void;
  waitingForPrediction: boolean;
  predictions?: [];
}

class FlowerPredictionView extends PureComponent {
  static defaultProps = {
    predictions: [],
    errorMessage: null,
  }

  state = {
    showSnackbar: false,
  }

  onTookPhoto = (imageURL) => {
    const { fetchFlowerPrediction } = this.props;
    const { latitude: lat, longitude: lng } = this.geolocation.getPosition();
    fetchFlowerPrediction({
      imageURL,
      lat,
      lng,
    });
  }

  props: Props;

  render() {
    const {
      waitingForPrediction,
      predictions,
    } = this.props;
    const predictionView = (predictions.length) ? (
      <View style={styles.predictionInfo}>
        <Text style={styles.name}>
          {predictions[0].chineseName}
        </Text>
        <Text style={styles.predictions}>
          {(predictions[0].prob * 100).toFixed(2)}
        </Text>
      </View>
    ) : null;

    return (
      <View style={styles.container}>
        <Geolocation
          ref={(geolocation) => {
            this.geolocation = geolocation;
          }}
        />

        <Camera onTookPhoto={this.onTookPhoto} />

        { predictionView }

        <Spinner show={waitingForPrediction} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  waitingForPrediction: state.prediction.pending,
  predictions: state.prediction.predictions,
});

const mapDispatchToProps = dispatch => ({
  fetchFlowerPrediction({ ...args }) {
    dispatch(predictAction.fetchFlowerPrediction(args));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FlowerPredictionView);
