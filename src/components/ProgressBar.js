import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation
} from "react-native";
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

import { store, _APP_SETTINGS, _SCREEN, nav } from "../core"

export default class ProgressBar extends Component {

  constructor(props) {
    super(props);
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    const { progress, width, height, color } = this.props;
    return (
      <View style={{ ...styles.container, width, height }} >
        <View style={{ flex: progress, backgroundColor: color }} />
        <View style={{ flex: (1 - progress) }} />
      </View>
    );
  }
}

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string
};
ProgressBar.defaultProps = {
  progress: 0.5,
  width: 200,
  height: 40,
  color: "gray"
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
  },
  fill: {
    backgroundColor: colors.primary
  },

});