import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import PropTypes from 'prop-types';

import { store, _APP_SETTINGS, _SCREEN, nav, Generics } from "@Core"

const colors = _APP_SETTINGS.colors;

const LoadingIndicator = ({ text, color }) => {

  return (
    <View>
      <ActivityIndicator size="large" color={color} />
      <Text style={Generics.bigText} >{text}</Text>
    </View>
  );

};

LoadingIndicator.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string
};
LoadingIndicator.defaultProps = {
  text: 'Loading...',
  color: colors.primary
};

export default LoadingIndicator;