import {
  View,
  Platform,
  requireNativeComponent,
  StyleSheet,
  Animated
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import Emitter from 'tiny-emitter/instance';

let nativeComponentProps = {
  name: 'BlurView',
  propTypes: {
    ...View.propTypes,
    brightness: PropTypes.any,
    radius: PropTypes.number,
    downsampling: PropTypes.number,
    blurStyle: PropTypes.string,
    vibrant: PropTypes.bool,
  }
};

let SajjadBlurOverlay = Platform.select({
  ios: () => requireNativeComponent('SajjadBlurOverlay', nativeComponentProps),
  android: () => requireNativeComponent('RCTSajjadBlurOverlay', nativeComponentProps),
})();

export default class BlurOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBlurOverlay: false,
      fadeIn: new Animated.Value(0),
    }
  }

  componentDidMount() {
    Emitter.on('drawer-open', this.openOverlay);
    Emitter.on('drawer-close', this.closeOverlay);
  }

  componentWillUnmount() {
    Emitter.off('drawer-open', this.openOverlay);
    Emitter.off('drawer-close', this.closeOverlay);
  }

  render() {
    const { children } = this.props;
    return (
      this.state.showBlurOverlay ?
        <Animated.View style={[{ opacity: this.state.fadeIn }, styles.style]}>
          <SajjadBlurOverlay {...this.props} style={[this.props.customStyles, styles.style]}>
            <View style={[this.props.customStyles, styles.style]}>
              {children}
            </View>
          </SajjadBlurOverlay>
        </Animated.View> :
        null
    );
  }

  openOverlay = () => {
    const { blurringDuration = 500 } = this.props;
    this.setState({
      showBlurOverlay: true,
      fadeIn: new Animated.Value(0),
    }, () => {
      Animated.timing(
        this.state.fadeIn,
        {
          toValue: 1,
          duration: blurringDuration,
          useNativeDriver: true
        }
      ).start();
    })
  }

  closeOverlay = () => {
    const { blurringDuration = 500 } = this.props;
    Animated.timing(
      this.state.fadeIn,
      {
        toValue: 0,
        duration: blurringDuration,
        useNativeDriver: true
      }
    ).start(() => this.setState({ showBlurOverlay: false }));
  }
}

const styles = StyleSheet.create({
  style: {
    position: 'absolute',
    flex: 1,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: null,
    height: null,
    zIndex: 999,
  },
});

export function openOverlay() {
  Emitter.emit('drawer-open');
}

export function closeOverlay() {
  Emitter.emit('drawer-close');
}