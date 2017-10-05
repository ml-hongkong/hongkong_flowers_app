// @flow

import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as predictAction from '../actions/prediction';
import { Camera, Spinner, Snackbar, Geolocation } from '../common';

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
  probability: {
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
  name?: string;
  probability?: number;
  errorMessage?: string;
}

class FlowerPredictionView extends PureComponent {
  static defaultProps = {
    name: null,
    probability: null,
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
      name,
      probability,
      errorMessage,
    } = this.props;

    return (
      <View style={styles.container}>
        <Snackbar
          show={!!errorMessage}
          message={errorMessage}
        />

        <StatusBar
          backgroundColor="blue"
          barStyle="light-content"
        />

        <Geolocation
          ref={(geolocation) => {
            this.geolocation = geolocation;
          }}
        />

        <Camera onTookPhoto={this.onTookPhoto} />

        <View style={styles.predictionInfo}>
          <Text style={styles.name}>
            {name}
          </Text>

          <Text style={styles.probability}>
            {probability}
          </Text>
        </View>

        <Spinner show={waitingForPrediction} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  waitingForPrediction: state.prediction.pending,
  name: state.prediction.name,
  probability: state.prediction.probability,
  errorMessage: get(state.prediction, 'error.message'),
});

const mapDispatchToProps = dispatch => ({
  fetchFlowerPrediction({ ...args }) {
    dispatch(predictAction.fetchFlowerPrediction(args));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FlowerPredictionView);
