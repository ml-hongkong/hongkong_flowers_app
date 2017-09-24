// @flow

import { PureComponent } from 'react';

type Props = {
  onPositionUpdated?: (position: Object) => void,
  onError?: (error: Object) => void,
}

export default class Geolocation extends PureComponent {
  static defaultProps = {
    onPositionUpdated: () => {},
    onError: () => {},
  }

  static options = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 1000,
    distanceFilter: 10,
  };

  state = {
    latitude: null,
    longitude: null,
    error: null,
  };

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      this.handlePositionUpdate,
      this.handleError,
      Geolocation.options,
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  getPosition = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
  })

  props: Props

  handlePositionUpdate = (position) => {
    const { onPositionUpdated } = this.props;
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: null,
    });
    onPositionUpdated(position);
  }

  handleError = (error) => {
    const { onError } = this.props;
    this.setState({ error: error.message });
    onError(error);
  }

  render() {
    return null;
  }
}
