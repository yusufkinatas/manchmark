import React, { Component } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import PropTypes from "prop-types";

export default class DelayedText extends Component {

  constructor(props) {
    super(props);

    this.fadeInAnim = new Animated.Value(0);
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      Animated.timing(this.fadeInAnim, {
        duration: this.props.animationDuration,
        toValue: 1,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();
    }, this.props.delay);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <Animated.View
        style={{
          opacity: this.fadeInAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        }}
      >
        <Text style={this.props.style} >{this.props.children}</Text>
      </Animated.View>
    )
  }
}

DelayedText.propsTypes = {
  style: PropTypes.object,
  delay: PropTypes.number,
  animationDuration: PropTypes.number
}

DelayedText.defaultProps = {
  delay: 1000,
  animationDuration: 200
}
