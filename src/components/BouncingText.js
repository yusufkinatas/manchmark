import React, { Component } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
} from "react-native";
import PropTypes from "prop-types";

export default class BouncingText extends Component {

  constructor(props) {
    super(props);

    this.bounceAnim = new Animated.Value(0);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children != this.props.children) {
      this.bounceText();
    }
  }

  bounceText = () => {
    Animated.timing(this.bounceAnim, {
      duration: this.props.animationDuration * 0.25,
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(this.bounceAnim, {
        duration: this.props.animationDuration * 0.75,
        toValue: 0,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();
    });
  }

  render() {
    return (
      <Animated.View
        style={{
          scaleX: this.bounceAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, this.props.bounceRatio],
          }),
          scaleY: this.bounceAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, this.props.bounceRatio],
          })
        }}
      >
        <Text style={this.props.style} >{this.props.children}</Text>
      </Animated.View>
    )
  }
}

BouncingText.propsTypes = {
  style: PropTypes.object,
  bounceRatio: PropTypes.number,
  animationDuration: PropTypes.number
}

BouncingText.defaultProps = {
  bounceRatio: 1.3,
  animationDuration: 200
}
