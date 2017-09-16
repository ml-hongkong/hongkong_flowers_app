// @flow

import React, { PureComponent } from 'react';
import { View, StyleSheet, Button, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { get } from 'lodash';
import * as predictAction from '../actions/prediction';
import { Camera, Spinner, Snackbar } from '../common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

type Props = {
  fetchFlowerPrediction: () => void;
  waitingForPrediction: bool;
  prediction: Object,
}

class CameraView extends PureComponent {
  state = {
    showSnackbar: false,
  }

  onTookPhoto = (imageURL) => {
    const { fetchFlowerPrediction } = this.props;
    fetchFlowerPrediction({
      imageURL,
      lat: null,
      lng: null,
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

        <Camera onTookPhoto={this.onTookPhoto} />
        <Spinner show={waitingForPrediction} />

        <Button
          onPress={() => {
            this.setState({ showSnackbar: !this.state.showSnackbar });
          }}
          title="Toggle Snackbar"
        />
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
