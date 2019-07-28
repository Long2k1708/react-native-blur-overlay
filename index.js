import {
  View,
  Platform,
  requireNativeComponent,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types'

var nativeComponentProps = {
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

var RCTSajjadBlurOverlay = Platform.select({
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
    const { openOverlay = false } = this.props;
    if (openOverlay)
      this._openOverlay();
    else
      this._closeOverlay();
  }

  render() {
    const { children } = this.props;
    const { showBlurOverlay } = this.state;
    return (
      showBlurOverlay
        ? <Animated.View style={[{ opacity: this.state.fadeIn }, styles.style]}>
          <TouchableWithoutFeedback style={styles.style} onPress={this.props.onPress}>
            <RCTSajjadBlurOverlay {...this.props} style={[this.props.customStyles, styles.style]}>
              <View style={[this.props.customStyles, styles.style]}>
                {children}
              </View>
            </RCTSajjadBlurOverlay>
          </TouchableWithoutFeedback>
        </Animated.View>
        : null
    );
  }

  _openOverlay() {
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

  _closeOverlay() {
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
    //  resizeMode: 'cover',
    width: null,
    height: null,
    zIndex: 999,
  },
});
