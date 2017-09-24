// @flow

import React, { PureComponent } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as predictAction from '../actions/prediction';
import { Camera, Spinner, Snackbar, Geolocation } from '../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  fetchFlowerPrediction: ({
    imageURL: string;
    lat: number;
    lng: number;
  }) => void;
  waitingForPrediction: bool;
  prediction: Object;
}

class CameraView extends PureComponent {
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
    const { waitingForPrediction, prediction } = this.props;

    return (
      <View style={styles.container}>
        <Snackbar
          show={!!get(prediction, 'error', null)}
          message={get(prediction, 'error.message', null)}
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
        <Spinner show={waitingForPrediction} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  waitingForPrediction: state.prediction.pending,
  prediction: state.prediction,
});

const mapDispatchToProps = dispatch => ({
  fetchFlowerPrediction({ ...args }) {
    dispatch(predictAction.fetchFlowerPrediction(args));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraView);
