import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, ram, nav } from "../core"

export default class CounterBar extends Component {

  constructor(props) {
    super(props);
    this.width = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this.width, {
      duration: this.props.time,
      toValue: 1,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }

  render() {
    const { width, height, color, increasing } = this.props;
    return (
      <View style={{ ...styles.container, width, height }} >
        <Animated.View style={{
          flex: 1,
          backgroundColor: color,
          translateX: this.width.interpolate({
            inputRange: [0, 1],
            outputRange: increasing ? [-width, 0] : [0, -width],
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp'
          }),
        }} />
      </View>
    );
  }
}

CounterBar.propTypes = {
  time: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
CounterBar.defaultProps = {
  time: 5000,
  width: 200,
  height: 40,
  color: "gray",
};

const colors = _APP_SETTINGS.colors;
var styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 50,
    marginBottom: 10,
    overflow: "hidden"
  }
});